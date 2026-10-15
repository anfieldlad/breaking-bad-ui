'use client';

import { useState, type CSSProperties } from 'react';
import type { PendingReply } from '@/hooks/useChat';
import { useSmoothText } from '@/hooks/useSmoothText';
import { Markdown } from '@/components/ui/Markdown';
import { ReasoningPanel } from './ReasoningPanel';

const CURSOR = ' █';

// Fixed layout: random styles computed during render would reshuffle the
// bubbles on every frame.
const BUBBLES: CSSProperties[] = [
    { left: '12%', width: 8, height: 8, animationDuration: '2.2s', animationDelay: '0s' },
    { left: '31%', width: 12, height: 12, animationDuration: '1.6s', animationDelay: '0.7s' },
    { left: '52%', width: 6, height: 6, animationDuration: '2.8s', animationDelay: '1.3s' },
    { left: '71%', width: 14, height: 14, animationDuration: '1.9s', animationDelay: '0.4s' },
    { left: '88%', width: 9, height: 9, animationDuration: '2.5s', animationDelay: '1.8s' },
].map((style) => ({ ...style, bottom: '-20px' }));

/**
 * The reply currently streaming in. Reasoning is shown live while the model
 * thinks and collapses once the answer starts, unless the user toggled it.
 */
export const StreamingReply = ({ reply }: { reply: PendingReply }) => {
    const thought = useSmoothText(reply.thought);
    const answer = useSmoothText(reply.answer);
    const [userOpen, setUserOpen] = useState<boolean | null>(null);
    const thinking = reply.answer === '';

    if (!reply.thought && !reply.answer) return null;

    return (
        <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[80%]">
                {reply.thought && (
                    <ReasoningPanel
                        text={thought + (thought.length < reply.thought.length ? CURSOR : '')}
                        open={userOpen ?? thinking}
                        // Programmatic open/close also fires `toggle`; only
                        // remember choices that differ from the automatic state.
                        onToggle={(open) => open !== thinking && setUserOpen(open)}
                        openLabel={<span className="animate-pulse">{thinking ? 'Cooking binary meth...' : 'Reasoning'}</span>}
                    >
                        {thinking && BUBBLES.map((style, i) => <div key={i} className="bubble" style={style} />)}
                    </ReasoningPanel>
                )}

                {reply.answer && (
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-3xl glass-blue border-l-4 border-bad-blue">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[10px] font-black bg-bad-blue text-bad-black px-1 rounded">Az</span>
                            <span className="text-[10px] sm:text-xs font-bold text-bad-blue uppercase tracking-widest">The Pure Product</span>
                        </div>
                        <Markdown className="leading-relaxed text-sm sm:text-base">{answer + CURSOR}</Markdown>
                    </div>
                )}
            </div>
        </div>
    );
};
