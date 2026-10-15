'use client';

import { useState, type FormEvent } from 'react';
import { Spinner } from '@/components/ui/Spinner';

interface ChatInputProps {
    disabled: boolean;
    onSend: (question: string) => void;
}

export const ChatInput = ({ disabled, onSend }: ChatInputProps) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!value.trim() || disabled) return;
        onSend(value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative mb-4 sm:mb-8">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask the chemist..."
                aria-label="Ask a question"
                autoComplete="off"
                maxLength={4000}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 pr-14 sm:pr-16 text-sm sm:text-base focus:outline-none focus:border-bad-blue/50 focus:ring-1 focus:ring-bad-blue/50 transition-all"
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={!value.trim() || disabled}
                aria-label={disabled ? 'Sending message' : 'Send message'}
                className="absolute right-2 top-2 bottom-2 bg-bad-blue hover:bg-bad-blue/90 text-bad-black font-bold px-3 sm:px-4 rounded-lg sm:rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            >
                {disabled ? (
                    <Spinner className="h-5 w-5 text-bad-black" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                )}
            </button>
        </form>
    );
};
