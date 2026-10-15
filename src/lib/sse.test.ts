import { describe, expect, it } from 'vitest';
import { readSseJson } from './sse';

/** Build a body that delivers `text` in the given byte-sized pieces. */
function streamOf(...pieces: string[]): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    return new ReadableStream({
        start(controller) {
            for (const piece of pieces) controller.enqueue(encoder.encode(piece));
            controller.close();
        },
    });
}

async function collect(body: ReadableStream<Uint8Array>): Promise<unknown[]> {
    const events: unknown[] = [];
    for await (const event of readSseJson(body)) events.push(event);
    return events;
}

describe('readSseJson', () => {
    it('parses events delivered in one chunk', async () => {
        const body = streamOf('data: {"sources":["a.pdf"]}\n\ndata: {"answer":"hi"}\n\n');
        expect(await collect(body)).toEqual([{ sources: ['a.pdf'] }, { answer: 'hi' }]);
    });

    it('reassembles an event split across chunks', async () => {
        const body = streamOf('data: {"ans', 'wer":"Hel', 'lo"}\n', '\ndata: {"answer":" world"}\n\n');
        expect(await collect(body)).toEqual([{ answer: 'Hello' }, { answer: ' world' }]);
    });

    it('handles multi-byte characters split across chunks', async () => {
        const bytes = new TextEncoder().encode('data: {"answer":"⚗️"}\n\n');
        const body = new ReadableStream<Uint8Array>({
            start(controller) {
                for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
                controller.close();
            },
        });
        expect(await collect(body)).toEqual([{ answer: '⚗️' }]);
    });

    it('accepts CRLF separators and a final event without a blank line', async () => {
        const body = streamOf('data: {"answer":"a"}\r\n\r\ndata: {"error":"boom"}');
        expect(await collect(body)).toEqual([{ answer: 'a' }, { error: 'boom' }]);
    });

    it('ignores comments and non-data fields', async () => {
        const body = streamOf(': keep-alive\n\nevent: message\ndata: {"answer":"x"}\n\n');
        expect(await collect(body)).toEqual([{ answer: 'x' }]);
    });

    it('cancels the stream when the consumer stops early', async () => {
        let cancelled = false;
        const body = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(new TextEncoder().encode('data: {"answer":"1"}\n\n'));
            },
            cancel() {
                cancelled = true;
            },
        });
        for await (const event of readSseJson(body)) {
            expect(event).toEqual({ answer: '1' });
            break;
        }
        expect(cancelled).toBe(true);
    });
});
