'use client';

import { useEffect, useState } from 'react';
import type { PerformanceMetrics } from '@/lib/types';
import { performanceMonitor } from '@/lib/performance';

interface PerformanceMonitorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PerformanceMonitor({ isOpen, onClose }: PerformanceMonitorProps) {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        latency: 0,
        memoryUsage: 0,
        fps: 0,
        gpuActive: false,
    });
    const [summary, setSummary] = useState({
        averageLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        currentMemory: 0,
        peakMemory: 0,
        gpuActive: false,
    });

    useEffect(() => {
        if (!isOpen) return;

        // Update metrics every second
        const interval = setInterval(() => {
            const currentMetrics = performanceMonitor.getMetrics();
            const currentSummary = performanceMonitor.getSummary();

            setMetrics(currentMetrics);
            setSummary(currentSummary);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const getLatencyColor = (latency: number) => {
        if (latency < 2) return 'text-green-600 dark:text-green-400';
        if (latency < 4) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getMemoryColor = (memory: number) => {
        if (memory < 1.5) return 'text-green-600 dark:text-green-400';
        if (memory < 2.0) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getMemoryPercentage = (memory: number, limit: number = 2.5) => {
        return Math.min((memory / limit) * 100, 100);
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
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeInUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl font-bold text-white">Performance Monitor</h2>
                    </div>
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
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Real-time Metrics */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real-Time Metrics</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Current Latency */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Latency</span>
                                </div>
                                <p className={`text-3xl font-bold ${getLatencyColor(metrics.latency)}`}>
                                    {metrics.latency > 0 ? metrics.latency.toFixed(2) : '—'}s
                                </p>
                            </div>

                            {/* Memory Usage */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</span>
                                </div>
                                <p className={`text-3xl font-bold ${getMemoryColor(metrics.memoryUsage)}`}>
                                    {metrics.memoryUsage > 0 ? metrics.memoryUsage.toFixed(2) : '—'} GB
                                </p>
                                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                        style={{ width: `${getMemoryPercentage(metrics.memoryUsage)}%` }}
                                    />
                                </div>
                            </div>

                            {/* FPS */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis FPS</span>
                                </div>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {metrics.fps > 0 ? metrics.fps.toFixed(1) : '—'}
                                </p>
                            </div>

                            {/* GPU Status */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 7H7v6h6V7z" />
                                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPU Status</span>
                                </div>
                                <p className={`text-2xl font-bold ${metrics.gpuActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                    {metrics.gpuActive ? '✓ Active' : '○ Inactive'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Statistics */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                            {/* Average Latency */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Average Latency</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {summary.averageLatency > 0 ? `${summary.averageLatency.toFixed(2)}s` : '—'}
                                </span>
                            </div>

                            {/* Min/Max Latency */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Min / Max Latency</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {summary.minLatency > 0 ? `${summary.minLatency.toFixed(2)}s` : '—'} / {summary.maxLatency > 0 ? `${summary.maxLatency.toFixed(2)}s` : '—'}
                                </span>
                            </div>

                            {/* Peak Memory */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Peak Memory</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {summary.peakMemory > 0 ? `${summary.peakMemory.toFixed(2)} GB` : '—'}
                                </span>
                            </div>

                            {/* GPU Acceleration */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">GPU Acceleration</span>
                                <span className={`text-sm font-semibold ${summary.gpuActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                    {summary.gpuActive ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Performance Status */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Status</h3>

                        {performanceMonitor.isPerformanceAcceptable() ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-green-900 dark:text-green-200">Performance is Good</p>
                                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                            Your system is running optimally. All metrics are within acceptable ranges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-yellow-900 dark:text-yellow-200">Performance Could Be Better</p>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                            Consider optimizing your settings for better performance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Recommendations */}
                    {performanceMonitor.getRecommendations().length > 0 && (
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <ul className="space-y-2">
                                    {performanceMonitor.getRecommendations().map((recommendation, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-sm text-blue-800 dark:text-blue-200">
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <span>{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
