"use client";

import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { StreamingReply } from '@/components/chat/StreamingReply';
import { WakeUpNotice } from '@/components/chat/WakeUpNotice';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
    const { messages, pending, isBusy, isWakingUp, send } = useChat();
    const scrollRef = useAutoScroll<HTMLDivElement>();

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4 sm:mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">BREAKING <span className="text-bad-green italic">B.A.D.</span></h1>
                    <p className="text-foreground/70 italic text-sm sm:text-base">&quot;Breaking down files. Building up answers.&quot;</p>
                </div>
                <div className="hidden md:block" aria-hidden="true">
                    <div className="glass-blue px-4 py-2 rounded-xl flex items-center space-x-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-bad-black bg-bad-blue/20 flex items-center justify-center text-[10px] font-bold text-bad-blue">
                                    He
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-bad-blue uppercase tracking-tighter">Chemistry Active</span>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto mb-4 sm:mb-6 pr-2 sm:pr-4 space-y-3 sm:space-y-4 scroll-smooth"
            >
                {messages.map((msg, idx) => (
                    // Append-only transcript: the index is a stable key.
                    <MessageBubble key={idx} message={msg} />
                ))}

                {messages.length === 0 && !isBusy && <EmptyState onPick={send} />}

                {pending && <StreamingReply reply={pending} />}

                {isWakingUp && <WakeUpNotice />}
            </div>

            <ChatInput disabled={isBusy} onSend={send} />
        </div>
    );
}
