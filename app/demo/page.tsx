'use client';

import { useState, useRef } from 'react';
import VideoFeed from '@/components/VideoFeed';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import PrivacyIndicator from '@/components/PrivacyIndicator';
import SettingsPanel from '@/components/SettingsPanel';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import SampleGallery from '@/components/SampleGallery';
import Tooltip, { tooltipContent } from '@/components/Tooltip';
import { useKeyboardShortcuts, KeyboardShortcutsHelp, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { createInferenceManager } from '@/lib/inference-manager';
import type { AnalysisResult, AppConfig } from '@/lib/types';

export default function DemoPage() {
    const [cameraActive, setCameraActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [performanceOpen, setPerformanceOpen] = useState(false);
    const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
    const captureButtonRef = useRef<HTMLButtonElement>(null);

    // App configuration
    const [config, setConfig] = useState<AppConfig>({
        video: {
            resolution: { width: 640, height: 480 },
            captureInterval: 2,
            autoMode: false,
            frameBufferSize: 1,
        },
        inference: {
            pipeline: 'browser',
            model: 'llava:latest',
            quantization: 'Q4_K_M',
            maxTokens: 200,
            temperature: 0.7,
        },
        privacy: {
            saveHistory: false,
            autoClear: true,
            autoClearInterval: 60,
        },
        performance: {
            gpuAcceleration: true,
            memoryLimit: 2.5,
            frameBufferSize: 1,
        },
    });

    const handleFrameCapture = async (frameBase64: string) => {
        setProcessing(true);
        setError(null);

        try {
            console.log('Starting analysis...');

            // Create inference manager
            const inferenceManager = createInferenceManager(config.inference.pipeline);

            // Initialize if needed
            await inferenceManager.initialize((progress) => {
                console.log(`Initialization progress: ${progress}%`);
            });

            // Analyze the frame
            const result = await inferenceManager.analyze(frameBase64);

            console.log('Analysis complete:', result);
            setCurrentResult(result);
        } catch (err: any) {
            console.error('Analysis failed:', err);
            setError(err.message || 'Analysis failed');
        } finally {
            setProcessing(false);
        }
    };

    // Keyboard shortcuts
    const shortcuts: KeyboardShortcut[] = [
        {
            key: ' ',
            description: 'Capture frame',
            action: () => {
                if (cameraActive && !processing) {
                    captureButtonRef.current?.click();
                }
            },
        },
        {
            key: 's',
            description: 'Open settings',
            action: () => setSettingsOpen(true),
        },
        {
            key: 'p',
            description: 'Performance monitor',
            action: () => setPerformanceOpen(true),
        },
        {
            key: 'h',
            description: 'Show shortcuts help',
            action: () => setShortcutsHelpOpen(true),
        },
        {
            key: 'Escape',
            description: 'Close modals',
            action: () => {
                setSettingsOpen(false);
                setPerformanceOpen(false);
                setShortcutsHelpOpen(false);
            },
        },
    ];

    useKeyboardShortcuts(shortcuts);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Privacy Indicator */}
            <PrivacyIndicator
                cameraActive={cameraActive}
                processing={processing}
                pipeline={config.inference.pipeline}
            />

            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">🎥</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LocalVision AI</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Real-Time Vision Analysis</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            <Tooltip content={tooltipContent.pipeline}>
                                <button
                                    onClick={() => setSettingsOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                            </Tooltip>
                            <Tooltip content="View real-time performance metrics and system recommendations">
                                <button
                                    onClick={() => setPerformanceOpen(true)}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                    <span>Performance</span>
                                </button>
                            </Tooltip>
                            <Tooltip content="View keyboard shortcuts (or press H)">
                                <button
                                    onClick={() => setShortcutsHelpOpen(true)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden sm:inline">Help</span>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Video Feed */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            📹 Live Camera Feed
                        </h2>
                        <VideoFeed
                            onFrameCapture={handleFrameCapture}
                            config={{
                                resolution: { width: 640, height: 480 },
                                captureInterval: 2,
                                autoMode: false,
                                frameBufferSize: 1,
                            }}
                        />

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                📝 How to Use:
                            </h3>
                            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                                <li>Click "Enable Camera" to start your webcam</li>
                                <li>Click "Capture Frame" to analyze what the camera sees</li>
                                <li>View the AI analysis results on the right</li>
                                <li>All processing happens locally on your device!</li>
                            </ol>
                        </div>

                        {/* Sample Gallery */}
                        <div className="mt-6">
                            <SampleGallery
                                onImageSelect={(imageBase64, imageName) => {
                                    console.log('Sample image selected:', imageName);
                                    handleFrameCapture(imageBase64);
                                }}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Right Column - Analysis Results */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            🤖 AI Analysis Results
                        </h2>
                        <AnalysisDisplay result={currentResult} loading={processing} />

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-red-800 dark:text-red-200 font-medium">Analysis Error</p>
                                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-2">
                                🔒 Privacy Guarantee:
                            </h3>
                            <p className="text-sm text-purple-800 dark:text-purple-300">
                                Your video feed is processed entirely on your device. No data is sent to external servers.
                                The analysis happens using {config.inference.pipeline === 'ollama' ? 'Ollama running on localhost' : 'in-browser AI models'}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Private</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            All AI processing happens on your device. Your video never leaves your computer.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Real-Time Analysis</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Get instant descriptions and reasoning about what your camera sees.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl">🌐</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Offline First</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Works completely offline after initial setup. No internet required.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Made with ❤️ for privacy-conscious users
                        </p>
                        <div className="flex items-center space-x-6 mt-4 md:mt-0">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                🔒 Processing Locally
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                📡 No Network Activity
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                v1.0.0-demo
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Settings Panel */}
            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                config={config}
                onConfigChange={(newConfig: AppConfig) => {
                    setConfig(newConfig);
                }}
            />

            {/* Performance Monitor */}
            <PerformanceMonitor
                isOpen={performanceOpen}
                onClose={() => setPerformanceOpen(false)}
            />

            {/* Keyboard Shortcuts Help */}
            {shortcutsHelpOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                        onClick={() => setShortcutsHelpOpen(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeInUp">
                        <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                            <button
                                onClick={() => setShortcutsHelpOpen(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <KeyboardShortcutsHelp shortcuts={shortcuts} />
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    💡 <strong>Tip:</strong> Shortcuts work when you're not typing in an input field.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShortcutsHelpOpen(false)}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
