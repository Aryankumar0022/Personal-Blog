'use client';

// =============================================================================
// Nexus Journal — useKeyboardShortcut Hook
// =============================================================================

import { useCallback, useEffect } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Parsed representation of a keyboard shortcut combo.
 * @internal
 */
interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
}

// -----------------------------------------------------------------------------
// Parser
// -----------------------------------------------------------------------------

/**
 * Parse a human-readable shortcut string into modifier flags + key.
 *
 * @param combo - e.g. `"ctrl+k"`, `"shift+enter"`, `"escape"`, `"meta+shift+p"`
 * @returns Parsed shortcut object
 * @internal
 */
function parseShortcut(combo: string): ParsedShortcut {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());

  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta') || parts.includes('cmd'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  };
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Register a global keyboard shortcut that fires a callback.
 *
 * Supports modifier keys (`ctrl`, `shift`, `alt`, `meta` / `cmd`)
 * combined with any key. The listener is automatically cleaned up on unmount.
 *
 * @param combo    - Shortcut string (e.g. `"ctrl+k"`, `"escape"`, `"meta+shift+p"`)
 * @param callback - Function to invoke when the shortcut is pressed
 * @param options  - Optional configuration
 * @param options.enabled        - Whether the shortcut is active (default: `true`)
 * @param options.preventDefault - Whether to call `event.preventDefault()` (default: `true`)
 *
 * @example
 * ```tsx
 * // Open search on Ctrl+K / Cmd+K
 * useKeyboardShortcut('ctrl+k', () => setSearchOpen(true));
 *
 * // Close modal on Escape
 * useKeyboardShortcut('escape', () => setOpen(false));
 *
 * // Conditionally enabled
 * useKeyboardShortcut('ctrl+s', handleSave, { enabled: isEditing });
 * ```
 */
export function useKeyboardShortcut(
  combo: string,
  callback: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
  } = {},
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = parseShortcut(combo);

      const keyMatch =
        event.key.toLowerCase() === shortcut.key ||
        event.code.toLowerCase() === shortcut.key;

      const modifierMatch =
        event.ctrlKey === shortcut.ctrl &&
        event.metaKey === shortcut.meta &&
        event.shiftKey === shortcut.shift &&
        event.altKey === shortcut.alt;

      if (keyMatch && modifierMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [combo, callback, preventDefault],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
