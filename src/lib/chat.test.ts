import { describe, expect, it } from 'vitest';
import { type ChatMessage, toHistory } from './chat';

const user = (content: string): ChatMessage => ({ role: 'user', content });
const bot = (content: string, error?: string): ChatMessage => ({ role: 'assistant', content, error });

describe('toHistory', () => {
    it('maps roles to the backend vocabulary', () => {
        expect(toHistory([user('hi'), bot('hello')])).toEqual([
            { role: 'user', parts: [{ text: 'hi' }] },
            { role: 'model', parts: [{ text: 'hello' }] },
        ]);
    });

    it('drops failed answers together with their question', () => {
        const history = toHistory([user('a'), bot('A'), user('b'), bot('', 'boom'), user('c'), bot('C')]);
        expect(history.map((h) => h.parts[0].text)).toEqual(['a', 'A', 'c', 'C']);
    });

    it('keeps only the most recent messages, starting on a user turn', () => {
        const messages = [user('1'), bot('1'), user('2'), bot('2'), user('3'), bot('3')];
        expect(toHistory(messages, 3).map((h) => h.parts[0].text)).toEqual(['3', '3']);
        expect(toHistory(messages, 4).map((h) => h.parts[0].text)).toEqual(['2', '2', '3', '3']);
    });
});
