// Core Types for LocalVision AI

export type InferencePipeline = 'ollama' | 'browser';

export interface SystemCapabilities {
  webGPU: boolean;
  webAssembly: boolean;
  ollamaAvailable: boolean;
  recommendedPipeline: InferencePipeline;
  gpuInfo?: string;
  memoryLimit?: number;
}

export interface VideoConfig {
  resolution: {
    width: number;
    height: number;
  };
  captureInterval: number; // seconds
  autoMode: boolean;
  frameBufferSize: number;
}

export interface InferenceConfig {
  pipeline: InferencePipeline;
  model: string;
  quantization?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface PrivacyConfig {
  saveHistory: boolean;
  autoClear: boolean;
  autoClearInterval?: number; // minutes
}

export interface PerformanceConfig {
  gpuAcceleration: boolean;
  memoryLimit: number; // GB
  frameBufferSize: number;
}

export interface AppConfig {
  video: VideoConfig;
  inference: InferenceConfig;
  privacy: PrivacyConfig;
  performance: PerformanceConfig;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  caption: string;
  reasoning?: string;
  confidence: number;
  processingTime: number; // seconds
  pipeline: InferencePipeline;
  model: string;
}

export interface PerformanceMetrics {
  latency: number; // seconds
  memoryUsage: number; // GB
  fps: number;
  gpuActive: boolean;
  averageLatency?: number;
  peakMemory?: number;
}

export interface CameraState {
  active: boolean;
  stream: MediaStream | null;
  error: string | null;
  deviceId?: string;
  deviceLabel?: string;
}

export interface InferenceState {
  processing: boolean;
  progress: number; // 0-100
  error: string | null;
  lastResult: AnalysisResult | null;
}

export interface AppState {
  initialized: boolean;
  onboarding: boolean;
  camera: CameraState;
  inference: InferenceState;
  config: AppConfig;
  capabilities: SystemCapabilities | null;
  history: AnalysisResult[];
  metrics: PerformanceMetrics;
}

// Ollama API Types
export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  images?: string[]; // base64 encoded
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}

// Browser Inference Types (WebGPU/WASM)
export interface BrowserInferenceEngine {
  initialized: boolean;
  visionModel: any; // SmolVLM model
  reasoningModel: any; // llama.cpp model
  device: 'gpu' | 'cpu';
}

// Error Types
export type ErrorType = 
  | 'camera_not_found'
  | 'camera_permission_denied'
  | 'ollama_not_running'
  | 'ollama_connection_failed'
  | 'model_not_found'
  | 'inference_failed'
  | 'out_of_memory'
  | 'webgpu_not_supported'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: number;
  recoverable: boolean;
  suggestedAction?: string;
}
