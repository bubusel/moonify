import { useEffect } from 'react';

type Shortcut = {
  keys: string[];
  handler: () => void;
};

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      shortcuts.forEach(sc => {
        const match = sc.keys.every(k => {
          if (k === 'shift') return e.shiftKey;
          if (k === 'mod') return e.metaKey || e.ctrlKey;
          return e.key.toLowerCase() === k;
        });
        if (match) {
          e.preventDefault();
          sc.handler();
        }
      });
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcuts]);
}
