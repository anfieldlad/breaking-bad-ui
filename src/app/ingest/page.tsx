"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ensureBackendAvailable } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isWakingUp, setIsWakingUp] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [docCount, setDocCount] = useState<number | null>(null);
    const [isPurging, setIsPurging] = useState(false);
    const [confirmPurge, setConfirmPurge] = useState(false);
    const [purgePassword, setPurgePassword] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const refreshCount = useCallback(async () => {
        try {
            const res = await fetch(`${apiUrl}/api/documents/count`, {
                headers: { 'X-API-Key': apiKey },
                cache: 'no-store',
            });
            if (res.ok) {
                const data = await res.json();
                setDocCount(typeof data.count === 'number' ? data.count : null);
            }
        } catch {
            setDocCount(null);
        }
    }, []);

    useEffect(() => {
        refreshCount();
    }, [refreshCount]);

    const handlePurge = async () => {
        setIsPurging(true);
        setMessage(null);
        try {
            const isAvailable = await ensureBackendAvailable(setIsWakingUp);
            if (!isAvailable) throw new Error('Backend failed to wake up.');

            const res = await fetch(`${apiUrl}/api/documents?all=true`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': apiKey,
                    'X-Cleanup-Password': purgePassword,
                },
            });

            if (res.status === 403) {
                setMessage({ text: 'Wrong master password. The DEA stays out.', type: 'error' });
                return;
            }
            if (!res.ok) throw new Error('Purge failed');

            const result = await res.json();
            setMessage({
                text: `Evidence destroyed: ${result.deleted_count ?? 0} units wiped from the records.`,
                type: 'success',
            });
            setPurgePassword('');
            setConfirmPurge(false);
            await refreshCount();
        } catch (err) {
            console.error('Purge error:', err);
            setMessage({ text: 'Could not destroy the evidence. Try again.', type: 'error' });
        } finally {
            setIsPurging(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const isAvailable = await ensureBackendAvailable(setIsWakingUp);
            if (!isAvailable) {
                throw new Error('Backend failed to wake up.');
            }

            const response = await fetch(`${apiUrl}/api/ingest`, {
                method: 'POST',
                headers: {
                    'X-API-Key': apiKey
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload product');

            const result = await response.json();
            setMessage({
                text: `Batch processed: ${result.chunks_stored || 0} chemical units secured.`,
                type: 'success'
            });
            setFile(null);
            await refreshCount();
        } catch (err) {
            console.error("Upload error:", err);
            setMessage({ text: 'The batch was compromised. Try again.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">INGESTION <span className="text-bad-green">FACILITY</span></h1>
                <p className="text-foreground/70 italic text-sm sm:text-base">Securely cook your data into the system.</p>
            </div>

            <Card variant="green" className="mb-6 sm:mb-8">
                <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all duration-300 cursor-pointer ${file ? 'border-bad-green bg-bad-green/5' : 'border-white/10 hover:border-bad-green/50'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setFile(e.dataTransfer.files[0]);
                        }
                    }}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                    />

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bad-green/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-bad-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        {file ? (
                            <div className="px-2">
                                <p className="text-base sm:text-xl font-bold text-bad-green mb-1 break-all">{file.name}</p>
                                <p className="text-xs sm:text-sm text-foreground/70">{(file.size / 1024 / 1024).toFixed(2)} MB - Ready to cook</p>
                            </div>
                        ) : (
                            <div className="px-2">
                                <p className="text-base sm:text-xl font-medium mb-1">Drop the chemical cargo here</p>
                                <p className="text-xs sm:text-sm text-foreground/70 italic">Accepts .PDF format for high purity results</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full sm:w-auto min-w-[200px]"
                >
                    {isUploading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bad-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            COOKING...
                        </span>
                    ) : 'START INGESTION'}
                </Button>
            </div>

            {message && (
                <div className={`mt-8 p-4 rounded-xl glass ${message.type === 'success' ? 'border-bad-green/50 text-bad-green' : 'border-red-500/50 text-red-500'}`}>
                    <p className="font-bold flex items-center">
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </p>
                </div>
            )}

            {isWakingUp && (
                <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl glass border-bad-green/30 animate-pulse flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl">⚗️</span>
                        <div>
                            <p className="font-bold text-bad-green uppercase tracking-wider text-sm sm:text-base">Heating the laboratory...</p>
                            <p className="text-[10px] sm:text-xs text-foreground/65 italic">Waiting for backend to spin up</p>
                        </div>
                    </div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-bad-green/20 border-t-bad-green animate-spin flex-shrink-0" />
                </div>
            )}

            {/* Clean the Lab — purge all ingested documents */}
            <Card variant="default" className="mt-10 sm:mt-14 border border-red-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-red-400 tracking-tight flex items-center gap-2">
                            <span>🧹</span> Clean the Lab
                        </h2>
                        <p className="text-xs sm:text-sm text-foreground/70 mt-1">
                            Permanently remove <span className="font-bold text-foreground">all</span> ingested documents from the knowledge base.
                        </p>
                        <p className="text-[10px] sm:text-xs text-foreground/65 mt-2 uppercase tracking-widest">
                            Stored units:{' '}
                            <span className="text-bad-green font-bold">{docCount === null ? '—' : docCount}</span>
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        {!confirmPurge ? (
                            <button
                                onClick={() => setConfirmPurge(true)}
                                disabled={isPurging || docCount === 0}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Destroy All
                            </button>
                        ) : (
                            <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-72">
                                <p className="text-xs text-red-400 font-bold text-center sm:text-right">
                                    This cannot be undone. Enter the master password.
                                </p>
                                <input
                                    type="password"
                                    value={purgePassword}
                                    onChange={(e) => setPurgePassword(e.target.value)}
                                    placeholder="Master password"
                                    aria-label="Master password"
                                    autoComplete="off"
                                    disabled={isPurging}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && purgePassword.trim() && !isPurging) handlePurge();
                                    }}
                                    className="w-full bg-white/5 border border-red-500/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/50 transition-all"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setConfirmPurge(false); setPurgePassword(''); }}
                                        disabled={isPurging}
                                        className="flex-1 sm:flex-none border border-white/15 text-foreground/80 hover:bg-white/5 font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePurge}
                                        disabled={isPurging || !purgePassword.trim()}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-500/90 text-white font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {isPurging ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                Wiping...
                                            </>
                                        ) : 'Yes, destroy'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
