import type { ChatMessage } from '@/lib/chat';
import { Markdown } from '@/components/ui/Markdown';
import { ReasoningPanel } from './ReasoningPanel';
import { SourceChips } from './SourceChips';

/** A committed message in the transcript. */
export const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[90%] sm:max-w-[80%]">
                {!isUser && message.thought && <ReasoningPanel text={message.thought} />}

                <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-3xl ${isUser
                    ? 'bg-bad-green/10 border border-bad-green/20 text-foreground'
                    : 'glass-blue border-l-4 border-bad-blue'
                    }`}>
                    {message.content && (
                        <Markdown className="leading-relaxed text-sm sm:text-base">{message.content}</Markdown>
                    )}

                    {message.error && (
                        <p role="alert" className={`text-sm text-red-400 font-medium ${message.content ? 'mt-2' : ''}`}>
                            {message.error}
                        </p>
                    )}

                    {!isUser && message.sources && message.sources.length > 0 && (
                        <SourceChips sources={message.sources} />
                    )}
                </div>
            </div>
        </div>
    );
};
