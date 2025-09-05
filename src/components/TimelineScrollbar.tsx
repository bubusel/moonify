import React from 'react';
import { DateTime } from 'luxon';
import { animate } from 'framer-motion';
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
      className="w-full absolute top-0 appearance-none bg-transparent accent-ivory"
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

  const toPct = (min: number) => (min / 1440) * 100;

  useKeyboardShortcuts([
    { keys: ['arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 5 })) },
    { keys: ['arrowright'], handler: () => onChange(dateTime.plus({ minutes: 5 })) },
    { keys: ['shift', 'arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 30 })) },
    { keys: ['shift', 'arrowright'], handler: () => onChange(dateTime.plus({ minutes: 30 })) }
  ]);

  const times = getMoonTimes(DateTime.fromISO(date).toJSDate(), 0, 0);
  const rise = times.rise ? minutesSinceMidnight(DateTime.fromJSDate(times.rise)) : null;
  const set = times.set ? minutesSinceMidnight(DateTime.fromJSDate(times.set)) : null;

  const risePct = rise !== null ? toPct(rise) : null;
  const setPct = set !== null ? toPct(set) : null;

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

  const ranges: { start: number; dur: number }[] = [];
  if (rise !== null && set !== null) {
    if (rise < set) {
      ranges.push({ start: toPct(rise), dur: toPct(set - rise) });
    } else {
      ranges.push({ start: 0, dur: toPct(set) });
      ranges.push({ start: toPct(rise), dur: toPct(1440 - rise) });
    }
  } else if (rise !== null) {
    ranges.push({ start: toPct(rise), dur: toPct(1440 - rise) });
  } else if (set !== null) {
    ranges.push({ start: 0, dur: toPct(set) });
  }

  return (
    <div id="timeline" className="flex items-center gap-2 h-full w-full">
      <button
        id="timeline-prev"
        className="px-2 py-1 rounded bg-navy00 text-ivory"
        onClick={() => animateMove(-180)}
      >
        &laquo;
      </button>
      <div className="relative flex-1 h-full overflow-x-auto overflow-y-hidden">
        <TimelineRange minute={minute} onChange={handleRange} />
        <div id="timeline-ruler" className="absolute left-0 top-[40%] h-[30%] w-full">
          {ranges.map((r, idx) => (
            <div
              key={idx}
              className="absolute h-full bg-highlightIvory/30"
              style={{ left: `${r.start}%`, width: `${r.dur}%` }}
            />
          ))}
          <div className="grid grid-cols-24 items-end h-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="w-px h-2 bg-gridLine" />
                <div className="text-xs text-textMuted -translate-x-1/2">
                  {String(i).padStart(2, '0')}:00
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="timeline-markers" className="absolute left-0 top-[70%] w-full">
          {risePct !== null && riseLabel && (
            <div
              id="rise-marker"
              className="absolute -translate-x-1/2 flex flex-col items-center text-textPrimary"
              style={{ left: `${risePct}%` }}
            >
              <div className="text-2xl">↑</div>
              <div className="text-xs" data-time>
                {riseLabel}
              </div>
            </div>
          )}
          {setPct !== null && setLabel && (
            <div
              id="set-marker"
              className="absolute -translate-x-1/2 flex flex-col items-center text-textPrimary"
              style={{ left: `${setPct}%` }}
            >
              <div className="text-2xl">↓</div>
              <div className="text-xs" data-time>
                {setLabel}
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        id="timeline-next"
        className="px-2 py-1 rounded bg-navy00 text-ivory"
        onClick={() => animateMove(180)}
      >
        &raquo;
      </button>
    </div>
  );
};

export default TimelineScrollbar;
