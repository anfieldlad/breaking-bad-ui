const SUGGESTIONS = [
    'Summarize the key points of the documents.',
    'What topics are covered?',
    'List the main takeaways.',
];

export const EmptyState = ({ onPick }: { onPick: (question: string) => void }) => (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl glass-green flex items-center justify-center mb-5 text-3xl sm:text-4xl" aria-hidden="true">
            ⚗️
        </div>
        <h2 className="text-lg sm:text-2xl font-black tracking-tight mb-2">The lab is ready</h2>
        <p className="text-foreground/70 text-sm sm:text-base max-w-md mb-6">
            Ask about the documents you&apos;ve ingested. Try one of these:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
            {SUGGESTIONS.map((q) => (
                <button
                    key={q}
                    type="button"
                    onClick={() => onPick(q)}
                    className="text-xs sm:text-sm glass-blue border border-bad-blue/20 text-bad-blue/90 hover:text-bad-blue hover:border-bad-blue/50 px-3 py-2 rounded-xl transition-all active:scale-95"
                >
                    {q}
                </button>
            ))}
        </div>
    </div>
);
