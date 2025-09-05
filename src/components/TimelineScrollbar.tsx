import React from 'react';
import { DateTime } from 'luxon';
import { animate } from 'framer-motion';
import { colors } from '../constants/colors';
import { getMoonTimes, minutesSinceMidnight } from '../lib/astro';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface Props {
  dateTime: DateTime;
  onChange: (d: DateTime) => void;
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

const TimelineScrollbar: React.FC<Props> = ({ dateTime, onChange }) => {
  const minute = dateTime.hour * 60 + dateTime.minute;
  const date = dateTime.toISODate();

  useKeyboardShortcuts([
    { keys: ['arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 5 })) },
    { keys: ['arrowright'], handler: () => onChange(dateTime.plus({ minutes: 5 })) },
    { keys: ['shift', 'arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 30 })) },
    { keys: ['shift', 'arrowright'], handler: () => onChange(dateTime.plus({ minutes: 30 })) }
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

  const animateMove = (diff: number) => {
    const start = dateTime;
    animate(0, 1, {
      duration: 0.18,
      ease: 'easeOut',
      onUpdate: (t) => onChange(start.plus({ minutes: diff * t })),
      onComplete: () => onChange(start.plus({ minutes: diff }).startOf('minute')),
    });
  };

  const handleRange = (m: number) => {
    const d = dateTime.startOf('day').plus({ minutes: m, seconds: dateTime.second });
    onChange(d);
  };

  return (
    <div id="timeline" className="flex items-center space-x-2 h-full">
      <button
        id="timeline-prev"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => animateMove(-180)}
      >
        &lt;&lt;
      </button>
      <div className="relative flex-1 h-full">
        <TimelineRange minute={minute} onChange={handleRange} />
        <div
          id="selected-time-label"
          className="absolute text-xs"
          style={{ top: 0, left: `${handleLeft}%`, transform: 'translateX(-50%)', color: colors.ivory }}
        >
          {selectedLabel}
        </div>
        <div id="timeline-ruler" className="absolute left-0 right-0" style={{ top: '40%', height: '30%' }}>
          {highlightWidth !== null && riseLeft !== null && (
            <div
              id="moon-visible-range"
              className="absolute h-full"
              style={{
                left: `${riseLeft}%`,
                width: `${highlightWidth}%`,
                background: colors.highlightIvory,
                opacity: 0.3,
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
        </div>
        <div id="timeline-markers" className="absolute left-0 right-0" style={{ top: '70%' }}>
          {riseLeft !== null && riseLabel && (
            <div
              id="rise-marker"
              className="absolute text-xs"
              style={{ left: `${riseLeft}%`, transform: 'translateX(-50%)', color: colors.ivory }}
            >
              ↑ {riseLabel}
            </div>
          )}
          {setLeft !== null && setLabel && (
            <div
              id="set-marker"
              className="absolute text-xs"
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
        onClick={() => animateMove(180)}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default TimelineScrollbar;

