import React from 'react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { colors } from '../constants/colors';

interface Props {
  minute: number;
  onChange: (m: number) => void;
}

const TimelineScrollbar: React.FC<Props> = ({ minute, onChange }) => {
  useKeyboardShortcuts([
    { keys: ['arrowleft'], handler: () => onChange(Math.max(0, minute - 5)) },
    { keys: ['arrowright'], handler: () => onChange(Math.min(1439, minute + 5)) },
    { keys: ['shift', 'arrowleft'], handler: () => onChange(Math.max(0, minute - 30)) },
    { keys: ['shift', 'arrowright'], handler: () => onChange(Math.min(1439, minute + 30)) }
  ]);

  return (
    <input
      type="range"
      min={0}
      max={1439}
      value={minute}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full"
      style={{ accentColor: colors.ivory }}
    />
  );
};

export default TimelineScrollbar;
