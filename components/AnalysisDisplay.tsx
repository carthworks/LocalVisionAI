'use client';

import { useEffect, useState } from 'react';
import type { AnalysisResult } from '@/lib/types';

interface AnalysisDisplayProps {
    result: AnalysisResult | null;
    loading?: boolean;
}

export default function AnalysisDisplay({ result, loading = false }: AnalysisDisplayProps) {
    const [displayedCaption, setDisplayedCaption] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Typing effect for caption
    useEffect(() => {
        if (!result?.caption) {
            setDisplayedCaption('');
            return;
        }

        setIsTyping(true);
        setDisplayedCaption('');

        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < result.caption.length) {
                setDisplayedCaption(result.caption.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 30);

        return () => clearInterval(typingInterval);
    }, [result?.caption]);

    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
        if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getConfidenceLabel = (confidence: number) => {
        if (confidence >= 0.8) return 'High';
        if (confidence >= 0.6) return 'Medium';
        return 'Low';
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Analyzing image...</p>
                </div>
                <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Analysis Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Capture a frame to see AI analysis results
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeInUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Latest Analysis</h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Caption */}
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h4>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                            "{displayedCaption}"
                            {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                    </div>
                </div>

                {/* Reasoning */}
                {result.reasoning && (
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Reasoning</h4>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {result.reasoning}
                            </p>
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Confidence */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Confidence</span>
                        </div>
                        <p className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                            {Math.round(result.confidence * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {getConfidenceLabel(result.confidence)}
                        </p>
                    </div>

                    {/* Processing Time */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Speed</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {result.processingTime.toFixed(1)}s
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Processing
                        </p>
                    </div>

                    {/* Pipeline */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 7H7v6h6V7z" />
                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Pipeline</span>
                        </div>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400 capitalize">
                            {result.pipeline}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {result.model}
                        </p>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Time</span>
                        </div>
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {getTimeAgo(result.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
