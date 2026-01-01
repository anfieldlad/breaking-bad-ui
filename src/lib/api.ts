/**
 * Utility to ensure the backend is awake (handling Render free tier cold starts)
 */
export async function ensureBackendAvailable(
    onWait: (isWaiting: boolean) => void
): Promise<boolean> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const maxRetries = 5;
    const timeout = 5000; // 5 seconds per health check

    for (let i = 0; i < maxRetries; i++) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${apiUrl}/health`, {
                signal: controller.signal,
            });
            clearTimeout(id);

            if (response.ok) {
                onWait(false);
                return true;
            }
        } catch (error: unknown) {
            // If it's a timeout or connection error, the backend might be waking up
            onWait(true);
            console.log(`Backend waking up... attempt ${i + 1}`, error);

            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    onWait(false);
    return false;
}
