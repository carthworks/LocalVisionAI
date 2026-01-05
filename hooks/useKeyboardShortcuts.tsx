'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    action: () => void;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
}

export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcut[],
    options: UseKeyboardShortcutsOptions = {}
) {
    const { enabled = true } = options;

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            // Don't trigger shortcuts when typing in inputs
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            for (const shortcut of shortcuts) {
                const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
                const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const altMatches = shortcut.alt ? event.altKey : !event.altKey;

                if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        },
        [shortcuts, enabled]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Helper to format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    parts.push(shortcut.key.toUpperCase());

    return parts.join(' + ');
}

// Keyboard shortcuts help component
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                ⌨️ Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                    >
                        <span className="text-gray-600 dark:text-gray-400">
                            {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                            {formatShortcut(shortcut)}
                        </kbd>
                    </div>
                ))}
            </div>
        </div>
    );
}
