export const SourceChips = ({ sources }: { sources: string[] }) => (
    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-bad-blue/70 uppercase tracking-widest mr-1">Sources</span>
        {sources.map((src) => (
            <span key={src} className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-bad-blue/10 border border-bad-blue/20 text-bad-blue/90 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {src}
            </span>
        ))}
    </div>
);
