// Video Capture and Frame Processing Utilities
import type { VideoConfig } from './types';

/**
 * Frame Buffer for memory-efficient video processing
 */
export class FrameBuffer {
    private buffer: ImageData[] = [];
    private maxSize: number;

    constructor(maxSize: number = 1) {
        this.maxSize = maxSize;
    }

    /**
     * Add frame to buffer
     */
    add(frame: ImageData): void {
        if (this.buffer.length >= this.maxSize) {
            this.buffer.shift(); // Remove oldest frame
        }
        this.buffer.push(frame);
    }

    /**
     * Get latest frame
     */
    getLatest(): ImageData | null {
        return this.buffer[this.buffer.length - 1] || null;
    }

    /**
     * Get all frames
     */
    getAll(): ImageData[] {
        return [...this.buffer];
    }

    /**
     * Clear buffer
     */
    clear(): void {
        this.buffer = [];
    }

    /**
     * Get buffer size
     */
    size(): number {
        return this.buffer.length;
    }

    /**
     * Set max size
     */
    setMaxSize(size: number): void {
        this.maxSize = size;
        while (this.buffer.length > this.maxSize) {
            this.buffer.shift();
        }
    }
}

/**
 * Video Capture Manager
 */
export class VideoCapture {
    private stream: MediaStream | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private frameBuffer: FrameBuffer;
    private config: VideoConfig;

    constructor(config: VideoConfig) {
        this.config = config;
        this.frameBuffer = new FrameBuffer(config.frameBufferSize);
    }

    /**
     * Initialize camera stream
     */
    async initialize(videoElement: HTMLVideoElement): Promise<MediaStream> {
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: this.config.resolution.width },
                    height: { ideal: this.config.resolution.height },
                    facingMode: 'user',
                },
                audio: false,
            });

            this.stream = stream;
            this.videoElement = videoElement;

            // Set up video element
            videoElement.srcObject = stream;
            await videoElement.play();

            // Create canvas for frame extraction
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.config.resolution.width;
            this.canvas.height = this.config.resolution.height;
            this.ctx = this.canvas.getContext('2d', {
                willReadFrequently: true,
                alpha: false,
            });

            console.log('Camera initialized successfully');
            return stream;
        } catch (error) {
            console.error('Failed to initialize camera:', error);
            throw error;
        }
    }

    /**
     * Capture current frame
     */
    captureFrame(): ImageData | null {
        if (!this.videoElement || !this.canvas || !this.ctx) {
            console.warn('Video capture not initialized');
            return null;
        }

        try {
            // Draw current video frame to canvas
            this.ctx.drawImage(
                this.videoElement,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            // Get image data
            const imageData = this.ctx.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            // Add to buffer
            this.frameBuffer.add(imageData);

            return imageData;
        } catch (error) {
            console.error('Failed to capture frame:', error);
            return null;
        }
    }

    /**
     * Convert ImageData to base64
     */
    imageDataToBase64(imageData: ImageData): string {
        if (!this.canvas || !this.ctx) {
            throw new Error('Canvas not initialized');
        }

        // Put image data on canvas
        this.ctx.putImageData(imageData, 0, 0);

        // Convert to base64
        return this.canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    }

    /**
     * Capture and convert to base64 in one step
     */
    captureFrameAsBase64(): string | null {
        const frame = this.captureFrame();
        if (!frame) return null;

        return this.imageDataToBase64(frame);
    }

    /**
     * Get frame buffer
     */
    getFrameBuffer(): FrameBuffer {
        return this.frameBuffer;
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<VideoConfig>): void {
        this.config = { ...this.config, ...config };

        if (config.frameBufferSize !== undefined) {
            this.frameBuffer.setMaxSize(config.frameBufferSize);
        }

        if (config.resolution && this.canvas) {
            this.canvas.width = config.resolution.width;
            this.canvas.height = config.resolution.height;
        }
    }

    /**
     * Get current stream
     */
    getStream(): MediaStream | null {
        return this.stream;
    }

    /**
     * Get stream info
     */
    getStreamInfo(): {
        deviceId?: string;
        deviceLabel?: string;
        resolution: { width: number; height: number };
    } | null {
        if (!this.stream) return null;

        const videoTrack = this.stream.getVideoTracks()[0];
        if (!videoTrack) return null;

        const settings = videoTrack.getSettings();

        return {
            deviceId: videoTrack.id,
            deviceLabel: videoTrack.label,
            resolution: {
                width: settings.width || this.config.resolution.width,
                height: settings.height || this.config.resolution.height,
            },
        };
    }

    /**
     * Stop camera stream
     */
    stop(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement = null;
        }

        this.frameBuffer.clear();
        console.log('Camera stopped');
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        this.stop();
        this.canvas = null;
        this.ctx = null;
    }
}

/**
 * Auto-capture manager for continuous monitoring
 */
export class AutoCaptureManager {
    private intervalId: NodeJS.Timeout | null = null;
    private captureCallback: () => void;
    private interval: number; // seconds

    constructor(captureCallback: () => void, interval: number = 2) {
        this.captureCallback = captureCallback;
        this.interval = interval;
    }

    /**
     * Start auto-capture
     */
    start(): void {
        if (this.intervalId) {
            console.warn('Auto-capture already running');
            return;
        }

        console.log(`Starting auto-capture (interval: ${this.interval}s)`);

        // Immediate first capture
        this.captureCallback();

        // Set up interval
        this.intervalId = setInterval(() => {
            this.captureCallback();
        }, this.interval * 1000);
    }

    /**
     * Stop auto-capture
     */
    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Auto-capture stopped');
        }
    }

    /**
     * Update interval
     */
    setInterval(interval: number): void {
        this.interval = interval;

        if (this.intervalId) {
            this.stop();
            this.start();
        }
    }

    /**
     * Check if running
     */
    isRunning(): boolean {
        return this.intervalId !== null;
    }
}

/**
 * Memory-efficient image resizing
 */
export function resizeImage(
    imageData: ImageData,
    targetWidth: number,
    targetHeight: number
): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    ctx.putImageData(imageData, 0, 0);

    // Create target canvas
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;

    const targetCtx = targetCanvas.getContext('2d');
    if (!targetCtx) {
        throw new Error('Failed to get target canvas context');
    }

    // Draw resized image
    targetCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    return targetCtx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Calculate memory usage of ImageData
 */
export function calculateImageDataMemory(imageData: ImageData): number {
    // Each pixel has 4 bytes (RGBA)
    const bytes = imageData.width * imageData.height * 4;
    return bytes / (1024 * 1024); // Convert to MB
}

/**
 * Get available camera devices
 */
export async function getCameraDevices(): Promise<MediaDeviceInfo[]> {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
        console.error('Failed to enumerate camera devices:', error);
        return [];
    }
}

/**
 * Check camera permissions
 */
export async function checkCameraPermission(): Promise<PermissionState> {
    try {
        // @ts-ignore - camera permission is not in all browsers
        const result = await navigator.permissions.query({ name: 'camera' });
        return result.state;
    } catch (error) {
        console.warn('Permission API not supported:', error);
        return 'prompt';
    }
}
