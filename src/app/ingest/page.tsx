"use client";

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function IngestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            // Note: Base URL is handled by the browser if it's the same domain, 
            // otherwise it should be configured. Using relative path for proxy/local.
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
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
        } catch (err) {
            setMessage({ text: 'The batch was compromised. Try again.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2 tracking-tight">INGESTION <span className="text-bad-green">FACILITY</span></h1>
                <p className="text-foreground/50 italic">Securely cook your data into the system.</p>
            </div>

            <Card variant="green" className="mb-8">
                <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${file ? 'border-bad-green bg-bad-green/5' : 'border-white/10 hover:border-bad-green/50'
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
                        <div className="w-16 h-16 bg-bad-green/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bad-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        {file ? (
                            <div>
                                <p className="text-xl font-bold text-bad-green mb-1">{file.name}</p>
                                <p className="text-sm text-foreground/50">{(file.size / 1024 / 1024).toFixed(2)} MB - Ready to cook</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xl font-medium mb-1">Drop the chemical cargo here</p>
                                <p className="text-sm text-foreground/50 italic">Accepts .PDF format for high purity results</p>
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
        </div>
    );
}
