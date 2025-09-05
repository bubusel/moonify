import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import { getMoonTimes, minutesSinceMidnight } from '../lib/astro';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Props {
  date: string;
  minute: number;
  onChange: (m: number) => void;
}

const TimelineRange: React.FC<{ minute: number; onChange: (m: number) => void }> = ({ minute, onChange }) => {
  const rafRef = React.useRef<number>();
  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => onChange(value));
  };
  return (
    <input
      id="timeline-range"
      type="range"
      min={0}
      max={1439}
      value={minute}
      onChange={handleChange}
      className="w-full absolute top-0 appearance-none bg-transparent"
      style={{ accentColor: colors.ivory }}
    />
  );
};

function format(date: string, minute: number) {
  return DateTime.fromISO(date)
    .startOf('day')
    .plus({ minutes: minute })
    .toFormat('HH:mm:ss');
}

const TimelineScrollbar: React.FC<Props> = ({ date, minute, onChange }) => {
  useKeyboardShortcuts([
    { keys: ['arrowleft'], handler: () => onChange(Math.max(0, minute - 5)) },
    { keys: ['arrowright'], handler: () => onChange(Math.min(1439, minute + 5)) },
    { keys: ['shift', 'arrowleft'], handler: () => onChange(Math.max(0, minute - 30)) },
    { keys: ['shift', 'arrowright'], handler: () => onChange(Math.min(1439, minute + 30)) }
  ]);

  const times = getMoonTimes(DateTime.fromISO(date).toJSDate(), 0, 0);
  const rise = times.rise ? minutesSinceMidnight(DateTime.fromJSDate(times.rise)) : null;
  const set = times.set ? minutesSinceMidnight(DateTime.fromJSDate(times.set)) : null;

  const handleLeft = (minute / 1440) * 100;
  const riseLeft = rise !== null ? (rise / 1440) * 100 : null;
  const setLeft = set !== null ? (set / 1440) * 100 : null;

  const highlightWidth =
    riseLeft !== null && setLeft !== null ? setLeft - riseLeft : null;

  const selectedLabel = format(date, minute);
  const riseLabel = rise !== null ? format(date, rise) : null;
  const setLabel = set !== null ? format(date, set) : null;

  return (
    <div id="timeline" className="flex items-center space-x-2">
      <button
        id="timeline-prev"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => onChange((minute + 1440 - 720) % 1440)}
      >
        &lt;&lt;
      </button>
      <div className="relative flex-1 h-16">
        <TimelineRange minute={minute} onChange={onChange} />
        <div id="selected-time-label" className="absolute -top-5 text-xs" style={{ left: `${handleLeft}%`, transform: 'translateX(-50%)', color: colors.ivory }}>
          {selectedLabel}
        </div>
        <div id="timeline-ruler" className="absolute bottom-0 left-0 right-0 h-8">
          {highlightWidth !== null && riseLeft !== null && (
            <div
              id="moon-visible-range"
              className="absolute h-full"
              style={{
                left: `${riseLeft}%`,
                width: `${highlightWidth}%`,
                background: colors.highlightIvory,
                opacity: 0.3
              }}
            />
          )}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="absolute bottom-0" style={{ left: `${(i / 24) * 100}%` }}>
              <div className="w-px h-2" style={{ background: colors.gridLine }} />
              {i < 24 && (
                <div
                  className="text-xs"
                  style={{ color: colors.textMuted, transform: 'translateX(-50%)' }}
                >
                  {String(i).padStart(2, '0')}:00
                </div>
              )}
            </div>
          ))}
          {riseLeft !== null && riseLabel && (
            <div
              id="rise-marker"
              className="absolute bottom-0 text-xs"
              style={{ left: `${riseLeft}%`, transform: 'translateX(-50%)', color: colors.ivory }}
            >
              ↑ {riseLabel}
            </div>
          )}
          {setLeft !== null && setLabel && (
            <div
              id="set-marker"
              className="absolute bottom-0 text-xs"
              style={{ left: `${setLeft}%`, transform: 'translateX(-50%)', color: colors.ivory }}
            >
              ↓ {setLabel}
            </div>
          )}
        </div>
      </div>
      <button
        id="timeline-next"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => onChange((minute + 720) % 1440)}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default TimelineScrollbar;

