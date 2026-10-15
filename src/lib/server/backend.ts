/**
 * Server-side access to the Breaking B.A.D. backend.
 *
 * The backend API key lives only in server environment variables and is
 * attached here, so it never reaches the browser bundle. Import this module
 * from route handlers only.
 */

const DEFAULT_BACKEND_URL = 'http://localhost:8000';

export class BackendConfigError extends Error {}

function backendUrl(path: string, search = ''): string {
    const base = (process.env.BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, '');
    return `${base}${path}${search}`;
}

function apiKey(): string {
    const key = process.env.BACKEND_API_KEY;
    if (!key) {
        throw new BackendConfigError('BACKEND_API_KEY is not set');
    }
    return key;
}

/** Call a backend `/api/*` endpoint with the server-held API key attached. */
export function fetchBackendApi(
    path: string,
    init: RequestInit & { search?: string; duplex?: 'half' },
): Promise<Response> {
    const { search, headers, ...rest } = init;
    const merged = new Headers(headers);
    merged.set('X-API-Key', apiKey());
    return fetch(backendUrl(path, search), { ...rest, headers: merged, cache: 'no-store' });
}

/** Call the unauthenticated backend health endpoint. */
export function fetchBackendHealth(signal?: AbortSignal): Promise<Response> {
    return fetch(backendUrl('/health'), { signal, cache: 'no-store' });
}
