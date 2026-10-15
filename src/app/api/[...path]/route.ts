/**
 * Backend-for-frontend proxy.
 *
 * The browser calls `/api/*` on this app; we forward allowlisted requests to
 * the backend with the API key attached server-side. Responses (including
 * the chat SSE stream) are passed through unbuffered.
 */

import type { NextRequest } from 'next/server';
import { BackendConfigError, fetchBackendApi } from '@/lib/server/backend';

export const dynamic = 'force-dynamic';

/** Backend routes reachable through the proxy, keyed by path under /api. */
const ALLOWED_ROUTES: Record<string, readonly string[]> = {
    chat: ['POST'],
    ingest: ['POST'],
    documents: ['DELETE'],
    'documents/count': ['GET'],
};

const FORWARDED_REQUEST_HEADERS = ['content-type', 'accept', 'x-cleanup-password'];
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'cache-control', 'x-accel-buffering'];

function pickHeaders(source: Headers, names: readonly string[]): Headers {
    const picked = new Headers();
    for (const name of names) {
        const value = source.get(name);
        if (value !== null) picked.set(name, value);
    }
    return picked;
}

async function proxy(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
    const route = (await params).path.join('/');
    if (!ALLOWED_ROUTES[route]?.includes(request.method)) {
        return Response.json({ detail: 'Not found' }, { status: 404 });
    }

    const hasBody = request.method !== 'GET' && request.method !== 'DELETE';
    let upstream: Response;
    try {
        upstream = await fetchBackendApi(`/api/${route}`, {
            method: request.method,
            search: request.nextUrl.search,
            headers: pickHeaders(request.headers, FORWARDED_REQUEST_HEADERS),
            body: hasBody ? request.body : undefined,
            // Required by Node's fetch to stream a request body.
            duplex: hasBody ? 'half' : undefined,
            signal: request.signal,
        });
    } catch (error) {
        if (error instanceof BackendConfigError) {
            console.error('Proxy misconfigured:', error.message);
            return Response.json({ detail: 'Server is misconfigured.' }, { status: 500 });
        }
        console.error('Backend request failed:', error);
        return Response.json({ detail: 'Backend is unreachable.' }, { status: 502 });
    }

    return new Response(upstream.body, {
        status: upstream.status,
        headers: pickHeaders(upstream.headers, FORWARDED_RESPONSE_HEADERS),
    });
}

export { proxy as GET, proxy as POST, proxy as DELETE };
