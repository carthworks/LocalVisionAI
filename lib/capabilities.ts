// System Capabilities Detection
import type { SystemCapabilities, InferencePipeline } from './types';

/**
 * Detects WebGPU availability
 */
export async function detectWebGPU(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    if (!('gpu' in navigator)) {
        return false;
    }

    try {
        // @ts-ignore - WebGPU types may not be fully available
        const gpu = navigator.gpu as any;
        if (gpu && typeof gpu.requestAdapter === 'function') {
            const adapter = await gpu.requestAdapter();
            return adapter !== null;
        }
        return false;
    } catch (error) {
        console.warn('WebGPU detection failed:', error);
        return false;
    }
}

/**
 * Detects WebAssembly availability
 */
export function detectWebAssembly(): Promise<boolean> {
    return Promise.resolve(typeof WebAssembly !== 'undefined');
}

/**
 * Checks if Ollama is running on localhost
 */
export async function detectOllama(): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://localhost:11434/api/tags', {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Gets GPU information if available
 */
export async function getGPUInfo(): Promise<string | undefined> {
    if (typeof window === 'undefined') return undefined;

    try {
        // @ts-ignore - WebGPU types may not be fully available
        const gpu = navigator.gpu as any;
        if (!gpu || typeof gpu.requestAdapter !== 'function') {
            return undefined;
        }

        const adapter = await gpu.requestAdapter();
        if (!adapter) return undefined;

        // @ts-ignore - info property may not be in types yet
        const info = adapter.info || adapter.requestAdapterInfo?.();
        if (info) {
            return `${info.vendor || 'Unknown'} ${info.device || 'GPU'}`;
        }

        return 'WebGPU Available';
    } catch (error) {
        return undefined;
    }
}

/**
 * Estimates available memory
 */
export function getMemoryLimit(): number | undefined {
    if (typeof window === 'undefined') return undefined;

    // @ts-ignore - memory property is non-standard
    if (performance.memory) {
        // @ts-ignore
        const limit = performance.memory.jsHeapSizeLimit;
        return Math.round(limit / (1024 * 1024 * 1024) * 10) / 10; // GB
    }

    // Default estimate based on device
    if (typeof navigator !== 'undefined') {
        // @ts-ignore
        const deviceMemory = navigator.deviceMemory;
        if (deviceMemory) {
            return deviceMemory;
        }
    }

    return undefined;
}

/**
 * Comprehensive system capabilities check
 */
export async function detectSystemCapabilities(): Promise<SystemCapabilities> {
    const [webGPU, webAssembly, ollamaAvailable, gpuInfo, memoryLimit] = await Promise.all([
        detectWebGPU(),
        detectWebAssembly(),
        detectOllama(),
        getGPUInfo(),
        Promise.resolve(getMemoryLimit()),
    ]);

    // Determine recommended pipeline
    let recommendedPipeline: InferencePipeline = 'browser';

    if (ollamaAvailable) {
        recommendedPipeline = 'ollama';
    } else if (webGPU) {
        recommendedPipeline = 'browser';
    }

    return {
        webGPU,
        webAssembly,
        ollamaAvailable,
        recommendedPipeline,
        gpuInfo,
        memoryLimit,
    };
}

/**
 * Validates browser compatibility
 */
export function validateBrowserCompatibility(): {
    compatible: boolean;
    issues: string[];
} {
    const issues: string[] = [];

    // Check for modern browser features
    if (typeof window === 'undefined') {
        issues.push('Not running in browser environment');
        return { compatible: false, issues };
    }

    // Check for MediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        issues.push('MediaDevices API not supported');
    }

    // Check for Canvas API
    if (!document.createElement('canvas').getContext) {
        issues.push('Canvas API not supported');
    }

    // Check for modern JavaScript features
    if (typeof Promise === 'undefined') {
        issues.push('Promises not supported');
    }

    if (typeof fetch === 'undefined') {
        issues.push('Fetch API not supported');
    }

    // Warn about WebGPU (not required but recommended)
    if (!('gpu' in navigator)) {
        issues.push('WebGPU not supported (will use CPU fallback)');
    }

    return {
        compatible: issues.length === 0 || issues.every(i => i.includes('WebGPU')),
        issues,
    };
}

/**
 * Gets performance tier based on capabilities
 */
export function getPerformanceTier(capabilities: SystemCapabilities): 'high' | 'medium' | 'low' {
    if (capabilities.ollamaAvailable && capabilities.webGPU) {
        return 'high';
    }

    if (capabilities.webGPU || capabilities.ollamaAvailable) {
        return 'medium';
    }

    return 'low';
}

/**
 * Gets recommended settings based on capabilities
 */
export function getRecommendedSettings(capabilities: SystemCapabilities) {
    const tier = getPerformanceTier(capabilities);

    const settings = {
        high: {
            resolution: { width: 1280, height: 720 },
            captureInterval: 1,
            frameBufferSize: 3,
            memoryLimit: 3,
        },
        medium: {
            resolution: { width: 640, height: 480 },
            captureInterval: 2,
            frameBufferSize: 2,
            memoryLimit: 2,
        },
        low: {
            resolution: { width: 320, height: 240 },
            captureInterval: 5,
            frameBufferSize: 1,
            memoryLimit: 1.5,
        },
    };

    return settings[tier];
}
