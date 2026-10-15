'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/** Route-level error boundary: keeps the shell usable if a page crashes. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div role="alert" className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="text-4xl mb-4" aria-hidden="true">💥</div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">The lab blew up.</h1>
            <p className="text-foreground/70 mb-8">Something went wrong while rendering this page.</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}
