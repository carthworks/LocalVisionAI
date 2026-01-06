// Ollama Detection Cache
// Prevents repeated network requests to check Ollama availability

let ollamaCheckCache: { checked: boolean; available: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Cached Ollama detection
 * Prevents repeated network requests within the cache duration
 */
export async function detectOllamaCached(): Promise<boolean> {
    const now = Date.now();

    // Return cached result if still valid
    if (ollamaCheckCache && (now - ollamaCheckCache.timestamp) < CACHE_DURATION) {
        return ollamaCheckCache.available;
    }

    // Skip check in production/deployed environments
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        ollamaCheckCache = { checked: true, available: false, timestamp: now };
        return false;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        const response = await fetch('http://localhost:11434/api/tags', {
            signal: controller.signal,
            mode: 'cors',
            cache: 'no-cache',
        });

        clearTimeout(timeoutId);
        const available = response.ok;

        // Cache the result
        ollamaCheckCache = { checked: true, available, timestamp: now };
        return available;
    } catch (error) {
        // Cache the negative result
        ollamaCheckCache = { checked: true, available: false, timestamp: now };
        return false;
    }
}

/**
 * Clear the Ollama detection cache
 * Useful when user manually starts/stops Ollama
 */
export function clearOllamaCache(): void {
    ollamaCheckCache = null;
}
