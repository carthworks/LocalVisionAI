// Inference Manager - Coordinates between Ollama and Browser Inference
import { ollamaClient } from './ollama-client';
import { browserInference } from './browser-inference';
import { performanceMonitor } from './performance';
import type { AnalysisResult, InferencePipeline, InferenceConfig } from './types';

/**
 * Inference Manager Class
 * Handles dual pipeline architecture with automatic fallback
 */
export class InferenceManager {
    private config: InferenceConfig;
    private currentPipeline: InferencePipeline;
    private browserInitialized: boolean = false;

    constructor(config: InferenceConfig) {
        this.config = config;
        this.currentPipeline = config.pipeline;
    }

    /**
     * Initialize inference engine
     */
    async initialize(onProgress?: (progress: number) => void): Promise<void> {
        console.log(`Initializing inference with pipeline: ${this.currentPipeline}`);

        if (this.currentPipeline === 'ollama') {
            // Check if Ollama is available
            const available = await ollamaClient.isAvailable();

            if (!available) {
                console.warn('Ollama not available, falling back to browser inference');
                this.currentPipeline = 'browser';
            }
        }

        if (this.currentPipeline === 'browser') {
            if (!this.browserInitialized) {
                await browserInference.initialize(onProgress);
                this.browserInitialized = true;
                performanceMonitor.setGPUActive(browserInference.getDevice() === 'gpu');
            }
        }

        console.log('Inference engine initialized');
    }

    /**
     * Analyze image using current pipeline
     */
    async analyze(imageBase64: string): Promise<AnalysisResult> {
        const startTime = performance.now();

        try {
            let result: AnalysisResult;

            if (this.currentPipeline === 'ollama') {
                try {
                    result = await ollamaClient.analyze(imageBase64, this.config.model);
                } catch (error) {
                    console.error('Ollama analysis failed, falling back to browser:', error);

                    // Fallback to browser inference
                    if (!this.browserInitialized) {
                        await browserInference.initialize();
                        this.browserInitialized = true;
                    }

                    result = await browserInference.analyze(imageBase64);
                    this.currentPipeline = 'browser'; // Switch pipeline
                }
            } else {
                result = await browserInference.analyze(imageBase64);
            }

            const endTime = performance.now();
            const processingTime = (endTime - startTime) / 1000;

            // Record performance metrics
            performanceMonitor.recordLatency(processingTime);

            return result;
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    }

    /**
     * Analyze with streaming (Ollama only)
     */
    async *analyzeStream(
        imageBase64: string
    ): AsyncGenerator<string, void, unknown> {
        if (this.currentPipeline !== 'ollama') {
            throw new Error('Streaming only supported with Ollama pipeline');
        }

        try {
            yield* ollamaClient.analyzeStream(imageBase64, this.config.model);
        } catch (error) {
            console.error('Streaming analysis failed:', error);
            throw error;
        }
    }

    /**
     * Get current pipeline
     */
    getCurrentPipeline(): InferencePipeline {
        return this.currentPipeline;
    }

    /**
     * Switch pipeline
     */
    async switchPipeline(pipeline: InferencePipeline): Promise<void> {
        if (pipeline === this.currentPipeline) {
            console.log('Already using requested pipeline');
            return;
        }

        console.log(`Switching pipeline from ${this.currentPipeline} to ${pipeline}`);

        if (pipeline === 'ollama') {
            const available = await ollamaClient.isAvailable();
            if (!available) {
                throw new Error('Ollama not available');
            }
        } else if (pipeline === 'browser') {
            if (!this.browserInitialized) {
                await browserInference.initialize();
                this.browserInitialized = true;
                performanceMonitor.setGPUActive(browserInference.getDevice() === 'gpu');
            }
        }

        this.currentPipeline = pipeline;
        this.config.pipeline = pipeline;
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<InferenceConfig>): void {
        this.config = { ...this.config, ...config };

        if (config.pipeline && config.pipeline !== this.currentPipeline) {
            console.warn('Pipeline changed in config. Call switchPipeline() to apply.');
        }
    }

    /**
     * Get configuration
     */
    getConfig(): InferenceConfig {
        return { ...this.config };
    }

    /**
     * Check pipeline availability
     */
    async checkPipelineAvailability(): Promise<{
        ollama: boolean;
        browser: boolean;
    }> {
        const [ollamaAvailable] = await Promise.all([
            ollamaClient.isAvailable(),
        ]);

        return {
            ollama: ollamaAvailable,
            browser: true, // Browser inference always available
        };
    }

    /**
     * Get available models (Ollama only)
     */
    async getAvailableModels(): Promise<string[]> {
        if (this.currentPipeline !== 'ollama') {
            return ['SmolVLM + llama.cpp'];
        }

        try {
            const models = await ollamaClient.getVisionModels();
            return models.map(m => m.name);
        } catch (error) {
            console.error('Failed to get models:', error);
            return [];
        }
    }

    /**
     * Cleanup resources
     */
    async cleanup(): Promise<void> {
        if (this.browserInitialized) {
            await browserInference.cleanup();
            this.browserInitialized = false;
        }
    }
}

/**
 * Create inference manager with recommended settings
 */
export function createInferenceManager(
    pipeline: InferencePipeline,
    model?: string
): InferenceManager {
    const config: InferenceConfig = {
        pipeline,
        model: model || (pipeline === 'ollama' ? 'llava:latest' : 'SmolVLM'),
        quantization: 'Q4_K_M',
        maxTokens: 200,
        temperature: 0.7,
    };

    return new InferenceManager(config);
}
