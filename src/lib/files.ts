/** Client-side upload checks; the backend enforces the same rules. */

/** Keep in sync with the backend's MAX_UPLOAD_MB. */
export const MAX_UPLOAD_MB = 10;

/** Return a user-facing reason the file cannot be uploaded, or null if it is fine. */
export function validatePdf(file: File): string | null {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return `"${file.name}" is not a PDF. Only .pdf files can be cooked.`;
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
        return `"${file.name}" is larger than ${MAX_UPLOAD_MB} MB.`;
    }
    if (file.size === 0) return `"${file.name}" is empty.`;
    return null;
}
