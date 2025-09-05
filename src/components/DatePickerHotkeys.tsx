import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Props {
  date: string;
  onChange: (d: string) => void;
}

const DatePickerHotkeys: React.FC<Props> = ({ date, onChange }) => {
  useKeyboardShortcuts([
    { keys: ['t'], handler: () => onChange(DateTime.now().toISODate()) },
    { keys: ['y'], handler: () => onChange(DateTime.now().plus({ days: 1 }).toISODate()) }
  ]);

  return (
    <div id="date-picker" className="flex items-center space-x-2">
      <input
        id="date-input"
        type="date"
        value={date}
        onChange={e => onChange(e.target.value)}
        className="bg-navy00 text-textPrimary rounded px-2 py-1"
        style={{ background: colors.navy00, color: colors.textPrimary, colorScheme: 'dark' }}
      />
      <button
        id="btn-today"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => onChange(DateTime.now().toISODate())}
      >Today</button>
      <button
        id="btn-tomorrow"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => onChange(DateTime.now().plus({ days: 1 }).toISODate())}
      >Tomorrow</button>
    </div>
  );
};

export default DatePickerHotkeys;
