/**
 * Minimal Server-Sent Events reader for `fetch` response bodies.
 *
 * Network chunks do not line up with SSE events, so bytes are buffered until
 * a complete event (terminated by a blank line) is available.
 */

function parseEventData(frame: string): string | null {
    const dataLines = frame
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(line.startsWith('data: ') ? 6 : 5));
    return dataLines.length > 0 ? dataLines.join('\n') : null;
}

/** Yield the JSON-decoded `data` payload of each event in an SSE stream. */
export async function* readSseJson<T>(body: ReadableStream<Uint8Array>): AsyncGenerator<T> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finished = false;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                finished = true;
                buffer += decoder.decode();
            } else {
                buffer += decoder.decode(value, { stream: true });
            }
            buffer = buffer.replace(/\r\n?/g, '\n');

            let separator: number;
            while ((separator = buffer.indexOf('\n\n')) !== -1) {
                const data = parseEventData(buffer.slice(0, separator));
                buffer = buffer.slice(separator + 2);
                if (data !== null) yield JSON.parse(data) as T;
            }

            if (done) {
                // A final event without the trailing blank line.
                const data = parseEventData(buffer);
                if (data !== null) yield JSON.parse(data) as T;
                return;
            }
        }
    } finally {
        if (!finished) {
            // Consumer stopped early (break/abort/error): release the connection.
            reader.cancel().catch(() => {});
        }
    }
}
