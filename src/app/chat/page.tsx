"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    thought?: string;
    sources?: any[];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentThread, setCurrentThread] = useState<string>('');
    const [currentThought, setCurrentThought] = useState<string>('');
    const [displayThread, setDisplayThread] = useState<string>('');
    const [displayThought, setDisplayThought] = useState<string>('');
    const [isStreamFinished, setIsStreamFinished] = useState(false);
    const [bufferedSources, setBufferedSources] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, currentThread, currentThought, displayThread, displayThought]);

    // Typewriter effect logic
    useEffect(() => {
        let thoughtTimer: NodeJS.Timeout;
        if (displayThought.length < currentThought.length) {
            thoughtTimer = setTimeout(() => {
                setDisplayThought(currentThought.slice(0, displayThought.length + 2)); // 2 chars at a time for speed
            }, 15);
        }
        return () => clearTimeout(thoughtTimer);
    }, [currentThought, displayThought]);

    useEffect(() => {
        let threadTimer: NodeJS.Timeout;
        if (displayThread.length < currentThread.length) {
            threadTimer = setTimeout(() => {
                setDisplayThread(currentThread.slice(0, displayThread.length + 2));
            }, 10);
        }
        return () => clearTimeout(threadTimer);
    }, [currentThread, displayThread]);

    // Finalizer Effect: Only add to messages once typewriter is done
    useEffect(() => {
        if (isStreamFinished &&
            displayThread.length === currentThread.length &&
            displayThought.length === currentThought.length &&
            (currentThread !== '' || currentThought !== '')) {

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: currentThread,
                thought: currentThought,
                sources: bufferedSources
            }]);

            // Reset everything
            setCurrentThread('');
            setCurrentThought('');
            setDisplayThread('');
            setDisplayThought('');
            setBufferedSources([]);
            setIsStreamFinished(false);
            setIsTyping(false);
        }
    }, [isStreamFinished, displayThread, currentThread, displayThought, currentThought, bufferedSources]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setCurrentThread('');
        setCurrentThought('');
        setDisplayThread('');
        setDisplayThought('');
        setIsStreamFinished(false);
        setBufferedSources([]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input })
            });

            if (!response.body) throw new Error('No body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullAnswer = '';
            let fullThought = '';
            let sources = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.sources) {
                                setBufferedSources(data.sources);
                            }
                            if (data.thought) {
                                fullThought += data.thought;
                                setCurrentThought(fullThought);
                            }
                            if (data.answer) {
                                fullAnswer += data.answer;
                                setCurrentThread(fullAnswer);
                            }
                        } catch (e) {
                            console.error("Error parsing SSE chunk", e);
                        }
                    }
                }
            }

            setIsStreamFinished(true);
        } catch (err) {
            console.error("Chat error:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "The connection was lost. Someone must have talked to the DEA." }]);
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">BREAKING <span className="text-bad-green italic">B.A.D.</span></h1>
                    <p className="text-foreground/50 italic">"Breaking down files. Building up answers."</p>
                </div>
                <div className="hidden md:block">
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
                className="flex-1 overflow-y-auto mb-6 pr-4 space-y-4 scroll-smooth"
                ref={scrollRef}
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                            {msg.role === 'assistant' && msg.thought && (
                                <div className="mb-4 glass-green px-3 py-2 rounded-2xl border-l-4 border-bad-green/50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-[10px] font-black bg-bad-green text-bad-black px-1 rounded">Th</span>
                                        <span className="text-xs font-bold text-bad-green uppercase tracking-widest">Cooking the data...</span>
                                    </div>
                                    <div className="prose prose-invert max-w-none text-sm text-foreground/60 italic leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.thought}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            <div className={`px-4 py-2.5 rounded-3xl ${msg.role === 'user'
                                ? 'bg-bad-green/10 border border-bad-green/20 text-foreground'
                                : 'glass-blue border-l-4 border-bad-blue'
                                }`}>
                                <div className="prose prose-invert max-w-none leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Current Streaming Response */}
                {(currentThread || currentThought) && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%]">
                            {currentThought && (
                                <div className="mb-4 glass-green px-3 py-2 rounded-2xl border-l-4 border-bad-green/50 relative overflow-hidden">
                                    <div className="flex items-center space-x-2 mb-2 relative z-10">
                                        <span className="text-[10px] font-black bg-bad-green text-bad-black px-1 rounded">Th</span>
                                        <span className="text-xs font-bold text-bad-green uppercase tracking-widest animate-pulse">Cooking binary meth...</span>
                                    </div>
                                    <div className="prose prose-invert max-w-none text-sm text-foreground/60 italic leading-relaxed relative z-10">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {displayThought + (displayThought.length < currentThought.length ? ' \u2588' : '')}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Bubbles animation */}
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="bubble"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                bottom: '-20px',
                                                width: `${Math.random() * 10 + 5}px`,
                                                height: `${Math.random() * 10 + 5}px`,
                                                animationDuration: `${Math.random() * 2 + 1}s`,
                                                animationDelay: `${Math.random() * 2}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {currentThread && (
                                <div className="px-4 py-2.5 rounded-3xl glass-blue border-l-4 border-bad-blue">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-[10px] font-black bg-bad-blue text-bad-black px-1 rounded">Az</span>
                                        <span className="text-xs font-bold text-bad-blue uppercase tracking-widest">The Pure Product</span>
                                    </div>
                                    <div className="prose prose-invert max-w-none leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {displayThread + (isTyping ? ' \u2588' : '')}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="relative mb-8">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask the chemist..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 pr-16 focus:outline-none focus:border-bad-blue/50 focus:ring-1 focus:ring-bad-blue/50 transition-all"
                    disabled={isTyping}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-2 bottom-2 bg-bad-blue hover:bg-bad-blue/90 text-bad-black font-bold px-4 rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                >
                    {isTyping ? (
                        <svg className="animate-spin h-5 w-5 text-bad-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
