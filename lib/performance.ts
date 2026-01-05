// Performance Monitoring and Memory Management
import type { PerformanceMetrics } from './types';

/**
 * Performance Monitor Class
 */
export class PerformanceMonitor {
    private latencies: number[] = [];
    private maxLatencyHistory: number = 50;
    private memoryCheckInterval: NodeJS.Timeout | null = null;
    private currentMetrics: PerformanceMetrics = {
        latency: 0,
        memoryUsage: 0,
        fps: 0,
        gpuActive: false,
    };

    /**
     * Record inference latency
     */
    recordLatency(latency: number): void {
        this.latencies.push(latency);

        // Keep only recent latencies
        if (this.latencies.length > this.maxLatencyHistory) {
            this.latencies.shift();
        }

        this.currentMetrics.latency = latency;
        this.currentMetrics.averageLatency = this.getAverageLatency();
    }

    /**
     * Get average latency
     */
    getAverageLatency(): number {
        if (this.latencies.length === 0) return 0;

        const sum = this.latencies.reduce((a, b) => a + b, 0);
        return sum / this.latencies.length;
    }

    /**
     * Get current memory usage
     */
    getMemoryUsage(): number {
        if (typeof window === 'undefined') return 0;

        // @ts-ignore - performance.memory is non-standard
        if (performance.memory) {
            // @ts-ignore
            const used = performance.memory.usedJSHeapSize;
            return used / (1024 * 1024 * 1024); // Convert to GB
        }

        return 0;
    }

    /**
     * Get peak memory usage
     */
    getPeakMemory(): number {
        if (typeof window === 'undefined') return 0;

        // @ts-ignore
        if (performance.memory) {
            // @ts-ignore
            const total = performance.memory.totalJSHeapSize;
            return total / (1024 * 1024 * 1024); // Convert to GB
        }

        return 0;
    }

    /**
     * Start continuous memory monitoring
     */
    startMemoryMonitoring(interval: number = 1000): void {
        if (this.memoryCheckInterval) {
            console.warn('Memory monitoring already running');
            return;
        }

        this.memoryCheckInterval = setInterval(() => {
            const memoryUsage = this.getMemoryUsage();
            this.currentMetrics.memoryUsage = memoryUsage;

            const peakMemory = this.getPeakMemory();
            if (!this.currentMetrics.peakMemory || peakMemory > this.currentMetrics.peakMemory) {
                this.currentMetrics.peakMemory = peakMemory;
            }

            // Warn if memory usage is high
            if (memoryUsage > 2.0) {
                console.warn(`High memory usage: ${memoryUsage.toFixed(2)} GB`);
            }
        }, interval);
    }

    /**
     * Stop memory monitoring
     */
    stopMemoryMonitoring(): void {
        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
            this.memoryCheckInterval = null;
        }
    }

    /**
     * Set GPU active status
     */
    setGPUActive(active: boolean): void {
        this.currentMetrics.gpuActive = active;
    }

    /**
     * Set FPS
     */
    setFPS(fps: number): void {
        this.currentMetrics.fps = fps;
    }

    /**
     * Get current metrics
     */
    getMetrics(): PerformanceMetrics {
        return { ...this.currentMetrics };
    }

    /**
     * Reset metrics
     */
    reset(): void {
        this.latencies = [];
        this.currentMetrics = {
            latency: 0,
            memoryUsage: 0,
            fps: 0,
            gpuActive: false,
        };
    }

    /**
     * Get performance summary
     */
    getSummary(): {
        averageLatency: number;
        minLatency: number;
        maxLatency: number;
        currentMemory: number;
        peakMemory: number;
        gpuActive: boolean;
    } {
        return {
            averageLatency: this.getAverageLatency(),
            minLatency: this.latencies.length > 0 ? Math.min(...this.latencies) : 0,
            maxLatency: this.latencies.length > 0 ? Math.max(...this.latencies) : 0,
            currentMemory: this.getMemoryUsage(),
            peakMemory: this.getPeakMemory(),
            gpuActive: this.currentMetrics.gpuActive,
        };
    }

    /**
     * Check if performance is acceptable
     */
    isPerformanceAcceptable(targetLatency: number = 3.0): boolean {
        const avgLatency = this.getAverageLatency();
        const memoryUsage = this.getMemoryUsage();

        return avgLatency <= targetLatency && memoryUsage < 2.5;
    }

    /**
     * Get performance recommendations
     */
    getRecommendations(): string[] {
        const recommendations: string[] = [];
        const avgLatency = this.getAverageLatency();
        const memoryUsage = this.getMemoryUsage();

        if (avgLatency > 5.0) {
            recommendations.push('Consider reducing video resolution');
            recommendations.push('Try using a smaller model');
            if (!this.currentMetrics.gpuActive) {
                recommendations.push('Enable GPU acceleration if available');
            }
        }

        if (memoryUsage > 2.0) {
            recommendations.push('Reduce frame buffer size');
            recommendations.push('Close other browser tabs');
            recommendations.push('Consider restarting the application');
        }

        if (avgLatency > 3.0 && avgLatency <= 5.0) {
            recommendations.push('Performance is acceptable but could be improved');
            recommendations.push('Check if other applications are using resources');
        }

        return recommendations;
    }
}

/**
 * Memory Manager for aggressive cleanup
 */
export class MemoryManager {
    private cleanupCallbacks: Array<() => void> = [];
    private memoryPressureThreshold: number = 2.0; // GB
    private checkInterval: NodeJS.Timeout | null = null;

    /**
     * Register cleanup callback
     */
    registerCleanup(callback: () => void): void {
        this.cleanupCallbacks.push(callback);
    }

    /**
     * Unregister cleanup callback
     */
    unregisterCleanup(callback: () => void): void {
        this.cleanupCallbacks = this.cleanupCallbacks.filter(cb => cb !== callback);
    }

    /**
     * Force cleanup
     */
    forceCleanup(): void {
        console.log('Running forced cleanup...');

        this.cleanupCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Cleanup callback failed:', error);
            }
        });

        // Suggest garbage collection (non-standard)
        if (typeof window !== 'undefined' && 'gc' in window) {
            try {
                // @ts-ignore
                window.gc();
                console.log('Garbage collection triggered');
            } catch (error) {
                console.warn('Failed to trigger GC:', error);
            }
        }
    }

    /**
     * Start automatic memory pressure monitoring
     */
    startMonitoring(interval: number = 5000): void {
        if (this.checkInterval) {
            console.warn('Memory monitoring already running');
            return;
        }

        this.checkInterval = setInterval(() => {
            this.checkMemoryPressure();
        }, interval);
    }

    /**
     * Stop monitoring
     */
    stopMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Check memory pressure and cleanup if needed
     */
    private checkMemoryPressure(): void {
        // @ts-ignore
        if (performance.memory) {
            // @ts-ignore
            const used = performance.memory.usedJSHeapSize / (1024 * 1024 * 1024);

            if (used > this.memoryPressureThreshold) {
                console.warn(`Memory pressure detected: ${used.toFixed(2)} GB`);
                this.forceCleanup();
            }
        }
    }

    /**
     * Set memory pressure threshold
     */
    setThreshold(threshold: number): void {
        this.memoryPressureThreshold = threshold;
    }
}

/**
 * FPS Counter
 */
export class FPSCounter {
    private frameCount: number = 0;
    private lastTime: number = performance.now();
    private fps: number = 0;
    private updateInterval: number = 1000; // ms

    /**
     * Record a frame
     */
    recordFrame(): void {
        this.frameCount++;

        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= this.updateInterval) {
            this.fps = Math.round((this.frameCount / elapsed) * 1000);
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    /**
     * Get current FPS
     */
    getFPS(): number {
        return this.fps;
    }

    /**
     * Reset counter
     */
    reset(): void {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
    }
}

/**
 * Benchmark utility
 */
export class Benchmark {
    /**
     * Measure inference latency
     */
    static async measureInference(
        inferenceFunc: () => Promise<any>
    ): Promise<number> {
        const start = performance.now();
        await inferenceFunc();
        const end = performance.now();
        return (end - start) / 1000; // Convert to seconds
    }

    /**
     * Run benchmark suite
     */
    static async runSuite(
        inferenceFunc: () => Promise<any>,
        iterations: number = 10,
        warmup: number = 2
    ): Promise<{
        average: number;
        min: number;
        max: number;
        median: number;
        p95: number;
    }> {
        const results: number[] = [];

        // Warmup runs
        console.log(`Running ${warmup} warmup iterations...`);
        for (let i = 0; i < warmup; i++) {
            await this.measureInference(inferenceFunc);
        }

        // Actual benchmark
        console.log(`Running ${iterations} benchmark iterations...`);
        for (let i = 0; i < iterations; i++) {
            const latency = await this.measureInference(inferenceFunc);
            results.push(latency);
            console.log(`Iteration ${i + 1}: ${latency.toFixed(2)}s`);
        }

        // Calculate statistics
        const sorted = [...results].sort((a, b) => a - b);
        const sum = results.reduce((a, b) => a + b, 0);

        return {
            average: sum / results.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            median: sorted[Math.floor(sorted.length / 2)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
        };
    }

    /**
     * Measure memory usage
     */
    static measureMemory(): {
        used: number;
        total: number;
        limit: number;
    } | null {
        // @ts-ignore
        if (performance.memory) {
            return {
                // @ts-ignore
                used: performance.memory.usedJSHeapSize / (1024 * 1024 * 1024),
                // @ts-ignore
                total: performance.memory.totalJSHeapSize / (1024 * 1024 * 1024),
                // @ts-ignore
                limit: performance.memory.jsHeapSizeLimit / (1024 * 1024 * 1024),
            };
        }

        return null;
    }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const memoryManager = new MemoryManager();
