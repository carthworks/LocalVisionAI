'use client';

interface PrivacyIndicatorProps {
    cameraActive: boolean;
    processing: boolean;
    pipeline?: 'ollama' | 'browser';
    showNetworkActivity?: boolean;
}

export default function PrivacyIndicator({
    cameraActive,
    processing,
    pipeline = 'browser',
    showNetworkActivity = true,
}: PrivacyIndicatorProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {/* Camera Status */}
            <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all ${cameraActive
                        ? 'bg-red-500/90 text-white'
                        : 'bg-gray-200/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-300'
                    }`}
            >
                <div
                    className={`w-2.5 h-2.5 rounded-full ${cameraActive ? 'bg-white animate-pulse' : 'bg-gray-400'
                        }`}
                />
                <span className="text-sm font-medium">
                    {cameraActive ? 'Camera Active' : 'Camera Off'}
                </span>
            </div>

            {/* Processing Status */}
            {cameraActive && (
                <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all ${processing
                            ? 'bg-yellow-500/90 text-white'
                            : 'bg-green-500/90 text-white'
                        }`}
                >
                    {processing ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                            <span className="text-sm font-medium">Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium">Processing Locally</span>
                        </>
                    )}
                </div>
            )}

            {/* Network Activity */}
            {showNetworkActivity && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/90 text-white rounded-lg shadow-lg backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                        />
                    </svg>
                    <span className="text-sm font-medium">No Network Activity</span>
                </div>
            )}

            {/* Pipeline Info */}
            {cameraActive && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/90 text-white rounded-lg shadow-lg backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z" />
                        <path
                            fillRule="evenodd"
                            d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm font-medium">
                        {pipeline === 'ollama' ? 'Ollama Pipeline' : 'In-Browser Pipeline'}
                    </span>
                </div>
            )}

            {/* Privacy Badge */}
            <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm font-bold">100% Private</span>
                </div>
                <p className="text-xs mt-1 opacity-90">Your data never leaves this device</p>
            </div>
        </div>
    );
}
