'use client';

import { useEffect, useRef } from 'react';

/** Keep a scroll container pinned to the bottom as its content changes. */
export function useAutoScroll<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new MutationObserver(() => {
            el.scrollTop = el.scrollHeight;
        });
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        return () => observer.disconnect();
    }, []);

    return ref;
}
