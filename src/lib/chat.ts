/** Chat transcript types and pure helpers (no React). */

import type { ChatHistoryItem } from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    thought?: string;
    sources?: string[];
    /** Set when the answer failed; such turns are not sent back as history. */
    error?: string;
}

/**
 * Maximum number of past messages sent as context. Keeps requests well under
 * the backend's history limit and bounds prompt size on long conversations.
 */
export const MAX_HISTORY_MESSAGES = 20;

/** Convert the transcript into model history: skip failed turns, keep the latest. */
export function toHistory(
    messages: ChatMessage[],
    limit = MAX_HISTORY_MESSAGES,
): ChatHistoryItem[] {
    const history = messages
        .filter((msg, i) => !msg.error && !(msg.role === 'user' && messages[i + 1]?.error))
        .map<ChatHistoryItem>((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));
    const recent = history.slice(-limit);
    // Start the window on a user turn so the model never sees an orphan reply.
    return recent[0]?.role === 'model' ? recent.slice(1) : recent;
}
