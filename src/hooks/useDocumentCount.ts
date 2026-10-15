'use client';

import { useCallback, useEffect, useState } from 'react';
import { countDocuments } from '@/lib/api';

/** Number of stored chunks (null while unknown or unavailable). */
export function useDocumentCount() {
    const [count, setCount] = useState<number | null>(null);

    const refresh = useCallback(
        () => countDocuments().then(setCount, () => setCount(null)),
        [],
    );

    useEffect(() => {
        let active = true;
        countDocuments().then(
            (value) => active && setCount(value),
            () => active && setCount(null),
        );
        return () => {
            active = false;
        };
    }, []);

    return { count, refresh };
}
