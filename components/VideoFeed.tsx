'use client';

import { useEffect, useRef, useState } from 'react';
import { VideoCapture } from '@/lib/video-capture';
import type { VideoConfig } from '@/lib/types';

interface VideoFeedProps {
    config?: Partial<VideoConfig>;
    onFrameCapture?: (frameBase64: string) => void;
    autoStart?: boolean;
}

export default function VideoFeed({
    config,
    onFrameCapture,
    autoStart = false
}: VideoFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoCapture, setVideoCapture] = useState<VideoCapture | null>(null);
    const [streamInfo, setStreamInfo] = useState<{
        deviceLabel?: string;
        resolution: { width: number; height: number };
    } | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Default configuration
    const defaultConfig: VideoConfig = {
        resolution: { width: 640, height: 480 },
        captureInterval: 2,
        autoMode: false,
        frameBufferSize: 1,
    };

    const finalConfig = { ...defaultConfig, ...config };

    useEffect(() => {
        if (autoStart) {
            startCamera();
        }

        return () => {
            // Cleanup on unmount
            if (videoCapture) {
                videoCapture.cleanup();
            }
        };
    }, []);

    const startCamera = async () => {
        if (!videoRef.current) {
            setError('Video element not ready');
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            const capture = new VideoCapture(finalConfig);
            const stream = await capture.initialize(videoRef.current);

            setVideoCapture(capture);
            setCameraActive(true);

            // Get stream info
            const info = capture.getStreamInfo();
            if (info) {
                setStreamInfo(info);
            }

            console.log('Camera started successfully');
        } catch (err: any) {
            let errorMessage = 'Failed to access camera';

            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera permission denied. Please allow camera access.';
            } else if (err.name === 'NotFoundError') {
                errorMessage = 'No camera found. Please connect a camera.';
            } else if (err.name === 'NotReadableError') {
                errorMessage = 'Camera is already in use by another application.';
            }

            setError(errorMessage);
            console.error('Camera error:', err);
        } finally {
            setIsInitializing(false);
        }
    };

    const stopCamera = () => {
        if (videoCapture) {
            videoCapture.stop();
            setVideoCapture(null);
            setCameraActive(false);
            setStreamInfo(null);
            console.log('Camera stopped');
        }
    };

    const captureFrame = () => {
        if (!videoCapture) {
            console.warn('Video capture not initialized');
            return;
        }

        const frameBase64 = videoCapture.captureFrameAsBase64();
        if (frameBase64) {
            console.log('Frame captured:', frameBase64.substring(0, 50) + '...');

            if (onFrameCapture) {
                onFrameCapture(frameBase64);
            }
        } else {
            console.error('Failed to capture frame');
        }
    };

    return (
        <div className="relative w-full">
            {/* Video Display */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-auto ${!cameraActive ? 'hidden' : ''}`}
                    style={{ maxHeight: '480px' }}
                />

                {/* Placeholder when camera is off */}
                {!cameraActive && (
                    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-lg">Camera Off</p>
                            <p className="text-gray-500 text-sm mt-2">Click "Enable Camera" to start</p>
                        </div>
                    </div>
                )}

                {/* Recording Indicator */}
                {cameraActive && (
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium">REC</span>
                    </div>
                )}

                {/* Resolution Info */}
                {cameraActive && streamInfo && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <span className="text-white text-xs font-mono">
                            {streamInfo.resolution.width}×{streamInfo.resolution.height}
                        </span>
                    </div>
                )}

                {/* Device Label */}
                {cameraActive && streamInfo?.deviceLabel && (
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <span className="text-white text-xs">
                            📹 {streamInfo.deviceLabel}
                        </span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-4 flex flex-wrap gap-3">
                {!cameraActive ? (
                    <button
                        onClick={startCamera}
                        disabled={isInitializing}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isInitializing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Initializing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Enable Camera</span>
                            </>
                        )}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={stopCamera}
                            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            <span>Stop Camera</span>
                        </button>

                        <button
                            onClick={captureFrame}
                            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Capture Frame</span>
                        </button>
                    </>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fadeIn">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-red-800 dark:text-red-200 font-medium">Camera Error</p>
                            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                            {error.includes('permission') && (
                                <button
                                    onClick={startCamera}
                                    className="mt-3 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Info Display */}
            {cameraActive && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                        ✓ Camera active and ready for analysis
                    </p>
                </div>
            )}
        </div>
    );
}
