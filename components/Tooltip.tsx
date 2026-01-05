'use client';

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    maxWidth?: string;
}

export default function Tooltip({
    content,
    children,
    position = 'top',
    delay = 300,
    maxWidth = '250px',
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const tooltipRect = tooltipRef.current?.getBoundingClientRect();

                let x = 0;
                let y = 0;

                switch (position) {
                    case 'top':
                        x = rect.left + rect.width / 2;
                        y = rect.top - (tooltipRect?.height || 0) - 8;
                        break;
                    case 'bottom':
                        x = rect.left + rect.width / 2;
                        y = rect.bottom + 8;
                        break;
                    case 'left':
                        x = rect.left - (tooltipRect?.width || 0) - 8;
                        y = rect.top + rect.height / 2;
                        break;
                    case 'right':
                        x = rect.right + 8;
                        y = rect.top + rect.height / 2;
                        break;
                }

                setCoords({ x, y });
                setIsVisible(true);
            }
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    const getTransformOrigin = () => {
        switch (position) {
            case 'top':
                return 'bottom center';
            case 'bottom':
                return 'top center';
            case 'left':
                return 'right center';
            case 'right':
                return 'left center';
            default:
                return 'center';
        }
    };

    const getTranslate = () => {
        switch (position) {
            case 'top':
            case 'bottom':
                return '-50%, 0';
            case 'left':
            case 'right':
                return '0, -50%';
            default:
                return '0, 0';
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="fixed z-[9999] pointer-events-none animate-fadeIn"
                    style={{
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                        transform: `translate(${getTranslate()})`,
                        transformOrigin: getTransformOrigin(),
                        maxWidth,
                    }}
                >
                    <div className="relative">
                        {/* Tooltip Content */}
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-700 dark:border-gray-600">
                            {content}
                        </div>

                        {/* Arrow */}
                        <div
                            className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 border-gray-700 dark:border-gray-600 transform rotate-45 ${position === 'top'
                                    ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r'
                                    : position === 'bottom'
                                        ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l'
                                        : position === 'left'
                                            ? 'right-[-4px] top-1/2 -translate-y-1/2 border-t border-r'
                                            : 'left-[-4px] top-1/2 -translate-y-1/2 border-b border-l'
                                }`}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

// Predefined tooltip content for common metrics
export const tooltipContent = {
    latency: 'Time taken to analyze an image, from capture to result. Lower is better. Target: <2s for Ollama, <5s for browser.',
    memory: 'RAM currently used by the application. Includes model weights and frame buffers. Limit can be configured in settings.',
    fps: 'Frames analyzed per second. Higher means faster continuous monitoring. Depends on your hardware and settings.',
    gpu: 'Whether GPU acceleration (WebGPU) is active. GPU provides 2-5x faster inference than CPU.',
    confidence: 'AI model\'s certainty about its analysis. Higher is more confident. Range: 0-100%.',
    pipeline: 'Inference method: Ollama (local server, faster) or Browser (in-browser, more accessible).',
    resolution: 'Video capture quality. Higher resolution = better accuracy but slower processing and more memory.',
    captureInterval: 'Time between automatic captures in auto mode. Lower = more frequent updates but higher resource usage.',
    temperature: 'AI creativity level. Lower = more precise/factual, Higher = more creative/varied responses.',
    saveHistory: 'Store analysis results locally in browser storage. Can be reviewed later. Disabled by default for privacy.',
    autoClear: 'Automatically delete old analysis history after a set time period.',
    gpuAcceleration: 'Use WebGPU for faster inference when available. Recommended for modern browsers.',
    memoryLimit: 'Maximum RAM the app will use. Prevents browser crashes on low-memory devices.',
};
