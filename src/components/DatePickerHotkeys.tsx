import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Props {
  dateTime: DateTime;
  onChange: (d: DateTime) => void;
}

const DatePickerHotkeys: React.FC<Props> = ({ dateTime, onChange }) => {
  useKeyboardShortcuts([
    { keys: ['t'], handler: () => onChange(DateTime.now()) },
    { keys: ['y'], handler: () => onChange(DateTime.now().plus({ days: 1 })) }
  ]);

  const dateValue = dateTime.toISODate();
  const timeValue = dateTime.toFormat('HH:mm:ss');

  return (
    <div id="date-picker" className="flex items-center space-x-2">
      <input
        id="date-input"
        type="date"
        value={dateValue}
        onChange={e => {
          const d = DateTime.fromISO(e.target.value);
          onChange(d.set({
            hour: dateTime.hour,
            minute: dateTime.minute,
            second: dateTime.second,
          }));
        }}
        className="rounded px-2 py-1"
        style={{ background: colors.navy10, color: colors.textPrimary, colorScheme: 'dark' }}
      />
      <input
        id="time-input"
        type="time"
        step="1"
        value={timeValue}
        onChange={e => {
          const [h, m, s] = e.target.value.split(':').map(Number);
          onChange(dateTime.set({ hour: h, minute: m, second: s }));
        }}
        className="rounded px-2 py-1"
        style={{ background: colors.navy10, color: colors.textPrimary, colorScheme: 'dark' }}
      />
      <button
        id="btn-today"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy10, color: colors.ivory }}
        onClick={() => onChange(DateTime.now())}
      >Today</button>
      <button
        id="btn-tomorrow"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy10, color: colors.ivory }}
        onClick={() => onChange(DateTime.now().plus({ days: 1 }))}
      >Tomorrow</button>
    </div>
  );
};

export default DatePickerHotkeys;
