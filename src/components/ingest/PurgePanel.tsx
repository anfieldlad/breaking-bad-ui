'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface PurgePanelProps {
    docCount: number | null;
    isPurging: boolean;
    /** Resolve to true on success so the form resets. */
    onPurge: (password: string) => Promise<boolean>;
}

/** "Clean the Lab": password-confirmed deletion of every ingested document. */
export const PurgePanel = ({ docCount, isPurging, onPurge }: PurgePanelProps) => {
    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');

    const cancel = () => {
        setConfirming(false);
        setPassword('');
    };

    const submit = async () => {
        if (!password.trim() || isPurging) return;
        if (await onPurge(password)) cancel();
    };

    return (
        <Card variant="default" className="mt-10 sm:mt-14 border border-red-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-red-400 tracking-tight flex items-center gap-2">
                        <span aria-hidden="true">🧹</span> Clean the Lab
                    </h2>
                    <p className="text-xs sm:text-sm text-foreground/70 mt-1">
                        Permanently remove <span className="font-bold text-foreground">all</span> ingested documents from the knowledge base.
                    </p>
                    <p className="text-[10px] sm:text-xs text-foreground/65 mt-2 uppercase tracking-widest">
                        Stored units:{' '}
                        <span className="text-bad-green font-bold">{docCount ?? '—'}</span>
                    </p>
                </div>

                <div className="flex-shrink-0">
                    {!confirming ? (
                        <button
                            type="button"
                            onClick={() => setConfirming(true)}
                            disabled={isPurging || docCount === 0}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Destroy All
                        </button>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submit();
                            }}
                            className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-72"
                        >
                            <p className="text-xs text-red-400 font-bold text-center sm:text-right">
                                This cannot be undone. Enter the master password.
                            </p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Master password"
                                aria-label="Master password"
                                autoComplete="off"
                                autoFocus
                                disabled={isPurging}
                                className="w-full bg-white/5 border border-red-500/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/50 transition-all"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={cancel}
                                    disabled={isPurging}
                                    className="flex-1 sm:flex-none border border-white/15 text-foreground/80 hover:bg-white/5 font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPurging || !password.trim()}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-500/90 text-white font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {isPurging ? <><Spinner className="h-4 w-4" /> Wiping...</> : 'Yes, destroy'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Card>
    );
};
