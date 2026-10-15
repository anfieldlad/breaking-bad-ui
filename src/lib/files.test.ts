import { describe, expect, it } from 'vitest';
import { MAX_UPLOAD_MB, validatePdf } from './files';

const fileOf = (name: string, size: number, type = '') =>
    new File([new Uint8Array(size)], name, { type });

describe('validatePdf', () => {
    it('accepts a PDF by MIME type or extension', () => {
        expect(validatePdf(fileOf('a.pdf', 10))).toBeNull();
        expect(validatePdf(fileOf('scan', 10, 'application/pdf'))).toBeNull();
    });

    it('rejects other file types', () => {
        expect(validatePdf(fileOf('notes.txt', 10, 'text/plain'))).toMatch(/not a PDF/);
    });

    it('rejects empty and oversized files', () => {
        expect(validatePdf(fileOf('a.pdf', 0))).toMatch(/empty/);
        expect(validatePdf(fileOf('a.pdf', MAX_UPLOAD_MB * 1024 * 1024 + 1))).toMatch(/larger than/);
    });
});
