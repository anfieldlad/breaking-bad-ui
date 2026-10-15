'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, ensureBackendAvailable, streamChat } from '@/lib/api';
import { type ChatMessage, toHistory } from '@/lib/chat';

const CONNECTION_LOST = 'The connection was lost. Someone must have talked to the DEA.';
const BACKEND_ASLEEP = 'Backend failed to wake up. Someone must have called the DEA.';
const EMPTY_ANSWER = 'The chemist came back empty-handed. Try asking again.';

/** The assistant reply currently being streamed. */
export interface PendingReply {
    thought: string;
    answer: string;
    sources: string[];
}

/**
 * Chat state machine: holds the transcript, streams one reply at a time and
 * always settles (success, backend error, network error or empty answer)
 * so the UI can never get stuck in a busy state.
 */
export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [pending, setPending] = useState<PendingReply | null>(null);
    const [isWakingUp, setIsWakingUp] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    // Stop streaming if the user navigates away mid-answer.
    useEffect(() => () => abortRef.current?.abort(), []);

    const send = useCallback(
        async (rawQuestion: string) => {
            const question = rawQuestion.trim();
            if (!question || pending) return;

            const controller = new AbortController();
            abortRef.current = controller;
            const history = toHistory(messages);
            const reply: PendingReply = { thought: '', answer: '', sources: [] };
            let error: string | undefined;

            setMessages((prev) => [...prev, { role: 'user', content: question }]);
            setPending({ ...reply });

            try {
                if (!(await ensureBackendAvailable(setIsWakingUp))) {
                    throw new ApiError(BACKEND_ASLEEP, 503);
                }
                const events = await streamChat(question, history, controller.signal);
                for await (const event of events) {
                    if (event.sources) reply.sources = event.sources;
                    if (event.thought) reply.thought += event.thought;
                    if (event.answer) reply.answer += event.answer;
                    if (event.error) error = event.error;
                    setPending({ ...reply });
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error('Chat error:', err);
                error = err instanceof ApiError ? err.message : CONNECTION_LOST;
            }

            if (!error && !reply.answer) error = EMPTY_ANSWER;
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: reply.answer,
                    thought: reply.thought,
                    sources: reply.sources,
                    error,
                },
            ]);
            setPending(null);
        },
        [messages, pending],
    );

    return { messages, pending, isBusy: pending !== null, isWakingUp, send };
}
