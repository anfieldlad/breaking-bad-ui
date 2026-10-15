'use client';

import { useEffect, useState } from 'react';
import { checkHealth } from '@/lib/api';

type Status = 'checking' | 'online' | 'offline';

const STYLES: Record<Status, { dot: string; text: string; ring: string; label: string }> = {
    checking: { dot: 'bg-bad-yellow', text: 'text-bad-yellow', ring: 'border-bad-yellow/30', label: 'Checking' },
    online: { dot: 'bg-bad-green', text: 'text-bad-green', ring: 'border-bad-green/40', label: 'Connected' },
    offline: { dot: 'bg-red-500', text: 'text-red-400', ring: 'border-red-500/40', label: 'Offline' },
};

/**
 * Live backend health indicator. Polls /health and reflects the lab's status.
 */
export const BackendStatus = ({ className = '' }: { className?: string }) => {
    const [status, setStatus] = useState<Status>('checking');

    useEffect(() => {
        let active = true;

        const check = async () => {
            const online = await checkHealth(AbortSignal.timeout(5000));
            if (active) setStatus(online ? 'online' : 'offline');
        };

        check();
        const interval = setInterval(check, 20000);
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    const s = STYLES[status];

    return (
        <div
            className={`inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border ${s.ring} px-3 py-1.5 rounded-xl transition-colors ${className}`}
            title={`Backend: ${s.label}`}
            aria-live="polite"
        >
            <span className="relative flex h-2 w-2">
                {status === 'online' && (
                    <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-60 animate-ping`} />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>{s.label}</span>
        </div>
    );
};
