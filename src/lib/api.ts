/**
 * Browser-side client for the Breaking B.A.D. API.
 *
 * All calls go to this app's own `/api/*` routes, which proxy to the backend
 * and attach the API key server-side (see `src/app/api`).
 */

import { readSseJson } from './sse';

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface ChatHistoryItem {
    role: 'user' | 'model';
    parts: { text: string }[];
}

/** One event of the `/api/chat` SSE stream. */
export interface ChatEvent {
    sources?: string[];
    thought?: string;
    answer?: string;
    error?: string;
}

async function toApiError(response: Response): Promise<ApiError> {
    let detail = `Request failed with HTTP ${response.status}`;
    try {
        const body = await response.json();
        if (typeof body?.detail === 'string') detail = body.detail;
    } catch {
        // Non-JSON error body; keep the generic message.
    }
    return new ApiError(detail, response.status);
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
    const response = await fetch(input, { cache: 'no-store', ...init });
    if (!response.ok) throw await toApiError(response);
    return (await response.json()) as T;
}

export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
    try {
        const response = await fetch('/api/health', { signal, cache: 'no-store' });
        return response.ok;
    } catch {
        return false;
    }
}

export async function countDocuments(): Promise<number> {
    const { count } = await requestJson<{ count: number }>('/api/documents/count');
    return count;
}

export async function ingestPdf(file: File): Promise<number> {
    const formData = new FormData();
    formData.append('file', file);
    const { chunks_stored } = await requestJson<{ chunks_stored: number }>('/api/ingest', {
        method: 'POST',
        body: formData,
    });
    return chunks_stored;
}

export async function purgeAllDocuments(cleanupPassword: string): Promise<number> {
    const { deleted_count } = await requestJson<{ deleted_count: number }>(
        '/api/documents?all=true',
        { method: 'DELETE', headers: { 'X-Cleanup-Password': cleanupPassword } },
    );
    return deleted_count;
}

/** Start a chat request and return its stream of events. */
export async function streamChat(
    question: string,
    history: ChatHistoryItem[],
    signal?: AbortSignal,
): Promise<AsyncGenerator<ChatEvent>> {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
        signal,
    });
    if (!response.ok) throw await toApiError(response);
    if (!response.body) throw new ApiError('Empty response from server', response.status);
    return readSseJson<ChatEvent>(response.body);
}

const WAKE_MAX_ATTEMPTS = 5;
const WAKE_TIMEOUT_MS = 5000;
const WAKE_RETRY_DELAY_MS = 2000;

/**
 * Wait for the backend to respond (handles hosting cold starts).
 * `onWait(true)` is called while retrying, `onWait(false)` when finished.
 */
export async function ensureBackendAvailable(
    onWait: (isWaiting: boolean) => void,
): Promise<boolean> {
    try {
        for (let attempt = 1; attempt <= WAKE_MAX_ATTEMPTS; attempt++) {
            if (await checkHealth(AbortSignal.timeout(WAKE_TIMEOUT_MS))) return true;
            if (attempt < WAKE_MAX_ATTEMPTS) {
                onWait(true);
                await new Promise((resolve) => setTimeout(resolve, WAKE_RETRY_DELAY_MS));
            }
        }
        return false;
    } finally {
        onWait(false);
    }
}
