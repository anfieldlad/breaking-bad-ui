import type { ReactNode } from 'react';
import { Markdown } from '@/components/ui/Markdown';

interface ReasoningPanelProps {
    text: string;
    /** Controlled open state (live stream); uncontrolled when omitted. */
    open?: boolean;
    onToggle?: (open: boolean) => void;
    /** Label shown while open; defaults to "Hide reasoning". */
    openLabel?: ReactNode;
    /** Extra decoration rendered inside the panel (e.g. bubbles). */
    children?: ReactNode;
}

/** Collapsible "Th" panel showing the model's reasoning. */
export const ReasoningPanel = ({ text, open, onToggle, openLabel = 'Hide reasoning', children }: ReasoningPanelProps) => (
    <details
        open={open}
        onToggle={onToggle ? (e) => onToggle(e.currentTarget.open) : undefined}
        className="group mb-2 sm:mb-3"
    >
        <summary className="cursor-pointer select-none list-none flex items-center gap-2 text-[10px] sm:text-xs font-bold text-bad-green/80 hover:text-bad-green uppercase tracking-widest transition-colors">
            <span className="text-[10px] font-black bg-bad-green/80 text-bad-black px-1 rounded">Th</span>
            <span className="group-open:hidden">Show reasoning</span>
            <span className="hidden group-open:inline">{openLabel}</span>
            <svg className="w-3 h-3 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </summary>
        <div className="mt-2 glass-green px-2 sm:px-3 py-2 rounded-xl sm:rounded-2xl border-l-4 border-bad-green/50 relative overflow-hidden">
            <Markdown className="text-xs sm:text-sm text-foreground/75 italic leading-relaxed relative z-10">{text}</Markdown>
            {children}
        </div>
    </details>
);
