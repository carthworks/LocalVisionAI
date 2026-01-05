'use client';

import { useState, useEffect } from 'react';
import type { AppConfig, InferencePipeline } from '@/lib/types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    config: AppConfig;
    onConfigChange: (config: AppConfig) => void;
    availableModels?: string[];
}

export default function SettingsPanel({
    isOpen,
    onClose,
    config,
    onConfigChange,
    availableModels = ['llava:latest', 'bakllava:latest'],
}: SettingsPanelProps) {
    const [localConfig, setLocalConfig] = useState<AppConfig>(config);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setLocalConfig(config);
        setHasChanges(false);
    }, [config, isOpen]);

    const handleChange = (section: keyof AppConfig, key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        onConfigChange(localConfig);
        setHasChanges(false);
        onClose();
    };

    const handleReset = () => {
        setLocalConfig(config);
        setHasChanges(false);
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
            localStorage.clear();
            alert('All data cleared successfully!');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto animate-slideIn">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Inference Settings */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 7H7v6h6V7z" />
                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inference</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Pipeline Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pipeline
                                </label>
                                <select
                                    value={localConfig.inference.pipeline}
                                    onChange={(e) => handleChange('inference', 'pipeline', e.target.value as InferencePipeline)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ollama">Ollama (Recommended)</option>
                                    <option value="browser">In-Browser</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {localConfig.inference.pipeline === 'ollama'
                                        ? 'Faster, requires Ollama installation'
                                        : 'Slower, no installation needed'}
                                </p>
                            </div>

                            {/* Model Selection (Ollama only) */}
                            {localConfig.inference.pipeline === 'ollama' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Model
                                    </label>
                                    <select
                                        value={localConfig.inference.model}
                                        onChange={(e) => handleChange('inference', 'model', e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {availableModels.map(model => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Temperature */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Temperature: {localConfig.inference.temperature?.toFixed(1) || 0.7}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={localConfig.inference.temperature || 0.7}
                                    onChange={(e) => handleChange('inference', 'temperature', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>Precise</span>
                                    <span>Creative</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Video Settings */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Resolution */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Resolution
                                </label>
                                <select
                                    value={`${localConfig.video.resolution.width}x${localConfig.video.resolution.height}`}
                                    onChange={(e) => {
                                        const [width, height] = e.target.value.split('x').map(Number);
                                        handleChange('video', 'resolution', { width, height });
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="320x240">320×240 (Low)</option>
                                    <option value="640x480">640×480 (Medium)</option>
                                    <option value="1280x720">1280×720 (High)</option>
                                </select>
                            </div>

                            {/* Capture Interval */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Capture Interval: {localConfig.video.captureInterval}s
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={localConfig.video.captureInterval}
                                    onChange={(e) => handleChange('video', 'captureInterval', parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>1s (Fast)</span>
                                    <span>10s (Slow)</span>
                                </div>
                            </div>

                            {/* Auto Mode */}
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Auto Mode
                                </label>
                                <button
                                    onClick={() => handleChange('video', 'autoMode', !localConfig.video.autoMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localConfig.video.autoMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localConfig.video.autoMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Frame Buffer Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Frame Buffer: {localConfig.video.frameBufferSize} frame(s)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={localConfig.video.frameBufferSize}
                                    onChange={(e) => handleChange('video', 'frameBufferSize', parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Privacy Settings */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Save History */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Save History
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Store analysis results locally</p>
                                </div>
                                <button
                                    onClick={() => handleChange('privacy', 'saveHistory', !localConfig.privacy.saveHistory)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localConfig.privacy.saveHistory ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localConfig.privacy.saveHistory ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Auto Clear */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Auto Clear
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically clear old data</p>
                                </div>
                                <button
                                    onClick={() => handleChange('privacy', 'autoClear', !localConfig.privacy.autoClear)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localConfig.privacy.autoClear ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localConfig.privacy.autoClear ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Clear All Data */}
                            <button
                                onClick={handleClearData}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Clear All Data
                            </button>
                        </div>
                    </section>

                    {/* Performance Settings */}
                    <section>
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                        </div>

                        <div className="space-y-4">
                            {/* GPU Acceleration */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        GPU Acceleration
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Use WebGPU when available</p>
                                </div>
                                <button
                                    onClick={() => handleChange('performance', 'gpuAcceleration', !localConfig.performance.gpuAcceleration)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localConfig.performance.gpuAcceleration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localConfig.performance.gpuAcceleration ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Memory Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Memory Limit: {localConfig.performance.memoryLimit} GB
                                </label>
                                <input
                                    type="range"
                                    min="1.5"
                                    max="4"
                                    step="0.5"
                                    value={localConfig.performance.memoryLimit}
                                    onChange={(e) => handleChange('performance', 'memoryLimit', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                    <button
                        onClick={handleReset}
                        disabled={!hasChanges}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
