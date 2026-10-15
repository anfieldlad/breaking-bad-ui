import { fetchBackendHealth } from '@/lib/server/backend';

export const dynamic = 'force-dynamic';

const HEALTH_TIMEOUT_MS = 5000;

/** Report whether the backend is reachable (used by the status badge and warm-up). */
export async function GET(): Promise<Response> {
    try {
        const upstream = await fetchBackendHealth(AbortSignal.timeout(HEALTH_TIMEOUT_MS));
        return Response.json(await upstream.json(), { status: upstream.status });
    } catch {
        return Response.json({ status: 'unreachable' }, { status: 503 });
    }
}
