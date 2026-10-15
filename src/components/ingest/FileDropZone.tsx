'use client';

import { useRef, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';

interface FileDropZoneProps {
    file: File | null;
    disabled?: boolean;
    onSelect: (file: File) => void;
}

/** Click, keyboard or drag-and-drop PDF picker. */
export const FileDropZone = ({ file, disabled = false, onSelect }: FileDropZoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const openPicker = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        // Reset so choosing the same file again still fires `change`.
        e.target.value = '';
        if (picked) onSelect(picked);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped && !disabled) onSelect(dropped);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
        }
    };

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            aria-label={file ? `Selected ${file.name}. Choose a different PDF` : 'Choose a PDF to upload'}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bad-green ${file ? 'border-bad-green bg-bad-green/5' : 'border-white/10 hover:border-bad-green/50'}`}
            onClick={openPicker}
            onKeyDown={handleKeyDown}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleChange}
                accept=".pdf,application/pdf"
                tabIndex={-1}
            />

            <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bad-green/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-bad-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
    );
};
