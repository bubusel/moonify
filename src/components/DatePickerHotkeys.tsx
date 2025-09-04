import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const DatePickerHotkeys: React.FC = () => {
  const [date, setDate] = useState(DateTime.now().toISODate());

  useKeyboardShortcuts([
    { keys: ['t'], handler: () => setDate(DateTime.now().toISODate()) },
    { keys: ['y'], handler: () => setDate(DateTime.now().plus({ days: 1 }).toISODate()) }
  ]);

  return (
    <div className="flex items-center space-x-2">
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="bg-navy00 text-textPrimary rounded px-2 py-1"
        style={{ background: colors.navy00, color: colors.textPrimary }}
      />
      <button
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => setDate(DateTime.now().toISODate())}
      >Today</button>
      <button
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => setDate(DateTime.now().plus({ days: 1 }).toISODate())}
      >Tomorrow</button>
    </div>
  );
};

export default DatePickerHotkeys;
