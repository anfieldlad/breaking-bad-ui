"use client";

import { useState } from 'react';
import { FileDropZone } from '@/components/ingest/FileDropZone';
import { PurgePanel } from '@/components/ingest/PurgePanel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useDocumentCount } from '@/hooks/useDocumentCount';
import { ApiError, ensureBackendAvailable, ingestPdf, purgeAllDocuments } from '@/lib/api';
import { validatePdf } from '@/lib/files';

const BACKEND_ASLEEP = 'Backend failed to wake up.';

type Status = { text: string; type: 'success' | 'error' } | null;

/** Prefer the server's explanation; fall back to a themed generic message. */
function errorText(err: unknown, fallback: string): string {
    return err instanceof ApiError ? `${fallback} (${err.message})` : fallback;
}

export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [isWakingUp, setIsWakingUp] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const { count, refresh } = useDocumentCount();

    const wakeBackend = async () => {
        if (!(await ensureBackendAvailable(setIsWakingUp))) {
            throw new ApiError(BACKEND_ASLEEP, 503);
        }
    };

    const handleSelect = (picked: File) => {
        const problem = validatePdf(picked);
        setStatus(problem ? { text: problem, type: 'error' } : null);
        setFile(problem ? null : picked);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setStatus(null);
        try {
            await wakeBackend();
            const chunksStored = await ingestPdf(file);
            setStatus({ text: `Batch processed: ${chunksStored} chemical units secured.`, type: 'success' });
            setFile(null);
            await refresh();
        } catch (err) {
            console.error('Upload error:', err);
            setStatus({ text: errorText(err, 'The batch was compromised. Try again.'), type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handlePurge = async (password: string): Promise<boolean> => {
        setIsPurging(true);
        setStatus(null);
        try {
            await wakeBackend();
            const deleted = await purgeAllDocuments(password);
            setStatus({ text: `Evidence destroyed: ${deleted} units wiped from the records.`, type: 'success' });
            await refresh();
            return true;
        } catch (err) {
            console.error('Purge error:', err);
            const text = err instanceof ApiError && err.status === 403
                ? `The DEA stays out: ${err.message}`
                : errorText(err, 'Could not destroy the evidence. Try again.');
            setStatus({ text, type: 'error' });
            return false;
        } finally {
            setIsPurging(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">INGESTION <span className="text-bad-green">FACILITY</span></h1>
                <p className="text-foreground/70 italic text-sm sm:text-base">Securely cook your data into the system.</p>
            </div>

            <Card variant="green" className="mb-6 sm:mb-8">
                <FileDropZone file={file} disabled={isUploading} onSelect={handleSelect} />
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full sm:w-auto min-w-[200px]"
                >
                    {isUploading ? (
                        <span className="flex items-center">
                            <Spinner className="-ml-1 mr-3 h-5 w-5 text-bad-black" />
                            COOKING...
                        </span>
                    ) : 'START INGESTION'}
                </Button>
            </div>

            {status && (
                <div
                    role={status.type === 'error' ? 'alert' : 'status'}
                    className={`mt-8 p-4 rounded-xl glass ${status.type === 'success' ? 'border-bad-green/50 text-bad-green' : 'border-red-500/50 text-red-500'}`}
                >
                    <p className="font-bold flex items-center">
                        {status.type === 'success' ? '✅' : '❌'} {status.text}
                    </p>
                </div>
            )}

            {isWakingUp && (
                <div role="status" className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl glass border-bad-green/30 animate-pulse flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl" aria-hidden="true">⚗️</span>
                        <div>
                            <p className="font-bold text-bad-green uppercase tracking-wider text-sm sm:text-base">Heating the laboratory...</p>
                            <p className="text-[10px] sm:text-xs text-foreground/65 italic">Waiting for backend to spin up</p>
                        </div>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-bad-green/20 border-t-bad-green animate-spin flex-shrink-0" />
                </div>
            )}

            <PurgePanel docCount={count} isPurging={isPurging} onPurge={handlePurge} />
        </div>
    );
}
