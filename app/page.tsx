'use client';

import { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Privacy-First Computer Vision</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                🔒 100% Local
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Real-Time Vision AI
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              That Respects Your Privacy
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Analyze live webcam video with AI—all processing happens on your device.
            Your data never leaves your computer.
          </p>
        </div>

        {/* System Check */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 animate-fadeIn">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 dark:text-gray-300">Checking your system...</p>
            </div>
          </div>
        ) : !compatibility?.compatible ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 mb-12 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-4">
              ⚠️ Browser Not Supported
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              Your browser doesn't support the required features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-red-600 dark:text-red-400 mb-6">
              {compatibility?.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
            <p className="text-red-700 dark:text-red-300">
              Please use Chrome 113+ or Edge 113+ for the best experience.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ✅ System Check Complete
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${capabilities?.webGPU ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                  <span className="text-sm">{capabilities?.webGPU ? '✓' : '⚠'}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">WebGPU</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capabilities?.webGPU ? 'Available (GPU acceleration enabled)' : 'Not available (will use CPU)'}
                  </p>
                  {capabilities?.gpuInfo && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{capabilities.gpuInfo}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${capabilities?.ollamaAvailable ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                  <span className="text-sm">{capabilities?.ollamaAvailable ? '✓' : '⚠'}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Ollama</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capabilities?.ollamaAvailable
                      ? 'Running (best performance)'
                      : 'Not detected (will use in-browser mode)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">WebAssembly</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capabilities?.webAssembly ? 'Supported' : 'Not supported'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                  <span className="text-sm">ℹ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Recommended Pipeline</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capabilities?.recommendedPipeline === 'ollama' ? 'Ollama (Fast)' : 'In-Browser (Accessible)'}
                  </p>
                </div>
              </div>
            </div>

            {capabilities?.memoryLimit && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Available Memory:</strong> ~{capabilities.memoryLimit.toFixed(1)} GB
                  {capabilities.memoryLimit < 8 && ' (8GB+ recommended for best performance)'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">100% Private</h3>
            <p className="text-gray-600 dark:text-gray-400">
              All AI processing happens on your device. Your video never leaves your computer.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Real-Time Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant descriptions and reasoning about what your camera sees.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Offline First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Works completely offline after initial setup. No internet required.
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12 animate-fadeInUp">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            LocalVision AI is currently in development. The core infrastructure is complete!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h4 className="text-xl font-semibold mb-3">✅ What's Implemented:</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Dual inference pipeline (Ollama + Browser)</li>
              <li>• Memory-efficient video processing</li>
              <li>• Performance monitoring & optimization</li>
              <li>• Complete design system</li>
              <li>• Comprehensive documentation</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h4 className="text-xl font-semibold mb-3">🚧 Coming Soon:</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Interactive UI components</li>
              <li>• Live webcam analysis</li>
              <li>• Settings panel</li>
              <li>• Onboarding wizard</li>
            </ul>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="https://github.com"
            className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">📚 Documentation</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Read the PRD, UX spec, and implementation guide
            </p>
          </a>

          <a
            href="https://github.com"
            className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">🔧 Developer Guide</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Learn how to contribute and extend the platform
            </p>
          </a>

          <a
            href="https://github.com"
            className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">🔒 Privacy Policy</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Understand our privacy guarantees and limitations
            </p>
          </a>
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
                v1.0.0-alpha
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

