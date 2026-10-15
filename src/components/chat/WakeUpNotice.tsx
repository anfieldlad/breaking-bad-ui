export const WakeUpNotice = () => (
    <div className="flex justify-center my-4" role="status">
        <div className="glass-green px-6 py-3 rounded-2xl border-2 border-bad-green/30 animate-pulse flex items-center space-x-3">
            <div className="relative" aria-hidden="true">
                <span className="text-xl">⚗️</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-bad-green rounded-full animate-ping" />
            </div>
            <div>
                <p className="text-sm font-black text-bad-green uppercase tracking-widest">Waking up the chemist...</p>
                <p className="text-[10px] text-foreground/65 italic">Cold start in progress</p>
            </div>
        </div>
    </div>
);
