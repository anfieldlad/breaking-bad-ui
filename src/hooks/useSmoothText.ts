'use client';

import { useEffect, useState } from 'react';

/**
 * Reveal streamed text progressively (typewriter effect), at most once per
 * animation frame. The step grows with the backlog so the display never lags
 * far behind the stream. Mount a fresh instance per message.
 */
export function useSmoothText(target: string): string {
    const [shown, setShown] = useState(0);

    useEffect(() => {
        if (shown >= target.length) return;
        const frame = requestAnimationFrame(() => {
            setShown((n) => Math.min(target.length, n + Math.max(2, Math.ceil((target.length - n) / 10))));
        });
        return () => cancelAnimationFrame(frame);
    }, [shown, target]);

    return target.slice(0, shown);
}
