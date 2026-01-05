'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { detectSystemCapabilities, validateBrowserCompatibility } from '@/lib/capabilities';
import type { SystemCapabilities } from '@/lib/types';

export default function Home() {
  const [capabilities, setCapabilities] = useState<SystemCapabilities | null>(null);
  const [compatibility, setCompatibility] = useState<{ compatible: boolean; issues: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSystem() {
      const compat = validateBrowserCompatibility();
      setCompatibility(compat);

      if (compat.compatible) {
        const caps = await detectSystemCapabilities();
        setCapabilities(caps);
      }

      setLoading(false);
    }

    checkSystem();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200/30 dark:bg-slate-700/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">🎥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">LocalVision AI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Privacy-First Computer Vision</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                100% Local
              </span>
              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium text-sm"
              >
                <span>Try Demo</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fadeIn">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 border border-blue-100 dark:border-blue-800">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Interactive Demo Available
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Enterprise-Grade Vision AI
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              With Privacy Built In
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Analyze live video with AI-powered computer vision. All processing happens locally on your device—
            <span className="font-semibold text-slate-900 dark:text-white">your data never leaves your infrastructure.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Try Interactive Demo</span>
            </Link>

            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
            >
              <span>Learn More</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">No Cloud Dependencies</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Open Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Enterprise Ready</span>
            </div>
          </div>
        </div>

        {/* System Check */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-8 mb-16 animate-fadeIn">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Checking system capabilities...</p>
            </div>
          </div>
        ) : !compatibility?.compatible ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 mb-16 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-4 flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Browser Compatibility Issue
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              Your browser doesn't support the required features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-red-600 dark:text-red-400 mb-6 ml-4">
              {compatibility?.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
            <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Recommendation: Please use Chrome 113+ or Edge 113+ for optimal compatibility.
              </p>
            </div>
          </div>
        ) : (
          <div id="features" className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-8 mb-16 animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <svg className="w-7 h-7 mr-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                System Compatibility Check
              </h3>
              <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
                Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${capabilities?.webGPU ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'}`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {capabilities?.webGPU ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">WebGPU</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {capabilities?.webGPU ? 'Available - GPU acceleration enabled' : 'Not available - CPU fallback active'}
                  </p>
                  {capabilities?.gpuInfo && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 font-mono">{capabilities.gpuInfo}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${capabilities?.ollamaAvailable ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'}`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {capabilities?.ollamaAvailable ? (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Ollama</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {capabilities?.ollamaAvailable ? 'Running - optimal performance' : 'Not detected - browser mode active'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">WebAssembly</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {capabilities?.webAssembly ? 'Supported and ready' : 'Not supported'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Recommended Pipeline</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {capabilities?.recommendedPipeline === 'ollama' ? 'Ollama (Optimal)' : 'In-Browser (Standard)'}
                  </p>
                </div>
              </div>
            </div>

            {capabilities?.memoryLimit && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Available Memory:</strong> ~{capabilities.memoryLimit.toFixed(1)} GB
                    {capabilities.memoryLimit < 8 && ' - 8GB+ recommended for optimal performance'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">100% Private</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All AI processing happens on your device. Your video data never leaves your infrastructure.
            </p>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-Time Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Get instant descriptions and insights about live video feeds with low-latency inference.
            </p>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Offline Capable</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Works completely offline after initial setup. No internet connection required for operation.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl p-10 text-white mb-16 shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-8 text-lg">
              Experience the power of privacy-first computer vision. Try our interactive demo to see LocalVision AI in action.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Launch Demo</span>
            </Link>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="https://github.com"
            className="group block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="text-3xl mb-4">📚</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Documentation</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Read the PRD, UX spec, and implementation guide
            </p>
            <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center text-sm">
              <span>Learn more</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a
            href="https://github.com"
            className="group block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="text-3xl mb-4">🔧</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Developer Guide</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Learn how to contribute and extend the platform
            </p>
            <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center text-sm">
              <span>Get started</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a
            href="https://github.com"
            className="group block bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
          >
            <div className="text-3xl mb-4">🔒</div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Understand our privacy guarantees and limitations
            </p>
            <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center text-sm">
              <span>Read policy</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 LocalVision AI. Built with privacy in mind.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Processing Locally
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                No Network Activity
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-500 font-mono">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
