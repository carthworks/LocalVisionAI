// Ollama Client for Local Inference
import type {
    OllamaModel,
    OllamaGenerateRequest,
    OllamaGenerateResponse,
    AnalysisResult,
} from './types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Ollama Client Class
 */
export class OllamaClient {
    private baseUrl: string;

    constructor(baseUrl: string = OLLAMA_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Check if Ollama is running
     */
    async isAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                signal: AbortSignal.timeout(2000),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * List available models
     */
    async listModels(): Promise<OllamaModel[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to list models: ${response.statusText}`);
            }

            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Failed to list Ollama models:', error);
            throw error;
        }
    }

    /**
     * Get vision-capable models
     */
    async getVisionModels(): Promise<OllamaModel[]> {
        const models = await this.listModels();

        // Filter for vision-capable models
        const visionModelNames = ['llava', 'bakllava', 'llava-phi3', 'moondream'];

        return models.filter(model =>
            visionModelNames.some(name => model.name.toLowerCase().includes(name))
        );
    }

    /**
     * Strip data URL prefix from base64 string
     * Ollama expects raw base64 without the data:image/...;base64, prefix
     */
    private stripDataUrlPrefix(base64String: string): string {
        // If it's a data URL, extract just the base64 part
        if (base64String.startsWith('data:')) {
            const base64Index = base64String.indexOf('base64,');
            if (base64Index !== -1) {
                return base64String.substring(base64Index + 7); // Skip 'base64,'
            }
        }
        return base64String;
    }

    /**
     * Generate analysis from image
     */
    async analyzeImage(
        imageBase64: string,
        model: string = 'llava:latest',
        prompt: string = 'Describe what you see in this image in detail. Explain what is happening and why.'
    ): Promise<OllamaGenerateResponse> {
        const startTime = performance.now();

        try {
            // Strip data URL prefix if present
            const cleanBase64 = this.stripDataUrlPrefix(imageBase64);

            const request: OllamaGenerateRequest = {
                model,
                prompt,
                images: [cleanBase64],
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 200,
                },
            };

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Ollama request failed: ${response.statusText}`);
            }

            const result: OllamaGenerateResponse = await response.json();

            const endTime = performance.now();
            const processingTime = (endTime - startTime) / 1000;

            console.log(`Ollama analysis completed in ${processingTime.toFixed(2)}s`);

            return result;
        } catch (error) {
            console.error('Ollama analysis failed:', error);
            throw error;
        }
    }

    /**
     * Analyze image and return structured result
     */
    async analyze(
        imageBase64: string,
        model: string = 'llava:latest'
    ): Promise<AnalysisResult> {
        const startTime = performance.now();

        try {
            // First, get a caption
            const captionResponse = await this.analyzeImage(
                imageBase64,
                model,
                'Provide a brief, one-sentence description of what you see in this image.'
            );

            // Then, get reasoning
            const reasoningResponse = await this.analyzeImage(
                imageBase64,
                model,
                'Explain in detail what is happening in this image and provide reasoning about the scene, objects, and context.'
            );

            const endTime = performance.now();
            const processingTime = (endTime - startTime) / 1000;

            // Extract confidence from response (simplified - Ollama doesn't provide this directly)
            const confidence = 0.85; // Default confidence for Ollama

            return {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                caption: captionResponse.response.trim(),
                reasoning: reasoningResponse.response.trim(),
                confidence,
                processingTime,
                pipeline: 'ollama',
                model,
            };
        } catch (error) {
            console.error('Ollama analysis failed:', error);
            throw error;
        }
    }

    /**
     * Streaming analysis (for better UX)
     */
    async *analyzeStream(
        imageBase64: string,
        model: string = 'llava:latest',
        prompt: string = 'Describe what you see in this image in detail.'
    ): AsyncGenerator<string, void, unknown> {
        try {
            // Strip data URL prefix if present
            const cleanBase64 = this.stripDataUrlPrefix(imageBase64);

            const request: OllamaGenerateRequest = {
                model,
                prompt,
                images: [cleanBase64],
                stream: true,
                options: {
                    temperature: 0.7,
                    num_predict: 200,
                },
            };

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Ollama request failed: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get response reader');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            if (data.response) {
                                yield data.response;
                            }
                        } catch (e) {
                            console.warn('Failed to parse streaming response:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming analysis failed:', error);
            throw error;
        }
    }

    /**
     * Pull a model (download if not available)
     */
    async pullModel(modelName: string, onProgress?: (progress: number) => void): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: modelName }),
            });

            if (!response.ok) {
                throw new Error(`Failed to pull model: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get response reader');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);

                            if (data.total && data.completed && onProgress) {
                                const progress = (data.completed / data.total) * 100;
                                onProgress(progress);
                            }

                            if (data.status === 'success') {
                                console.log(`Model ${modelName} pulled successfully`);
                            }
                        } catch (e) {
                            console.warn('Failed to parse pull response:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to pull model:', error);
            throw error;
        }
    }

    /**
     * Delete a model
     */
    async deleteModel(modelName: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: modelName }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete model: ${response.statusText}`);
            }

            console.log(`Model ${modelName} deleted successfully`);
        } catch (error) {
            console.error('Failed to delete model:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const ollamaClient = new OllamaClient();
