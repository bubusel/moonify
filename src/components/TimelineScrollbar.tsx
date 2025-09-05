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

  // scrolling state
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const ignoreScrollRef = React.useRef(false);
  const scrollRafRef = React.useRef<number>();
  React.useEffect(() => () => cancelAnimationFrame(scrollRafRef.current), []);

  const contentWidth = 2400; // px
  const pxPerMinute = contentWidth / 1440;

  useKeyboardShortcuts([
    { keys: ['arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 5 })) },
    { keys: ['arrowright'], handler: () => onChange(dateTime.plus({ minutes: 5 })) },
    { keys: ['shift', 'arrowleft'], handler: () => onChange(dateTime.minus({ minutes: 30 })) },
    { keys: ['shift', 'arrowright'], handler: () => onChange(dateTime.plus({ minutes: 30 })) }
  ]);

  const times = getMoonTimes(DateTime.fromISO(date).toJSDate(), 0, 0);
  const rise = times.rise ? minutesSinceMidnight(DateTime.fromJSDate(times.rise)) : null;
  const set = times.set ? minutesSinceMidnight(DateTime.fromJSDate(times.set)) : null;

  const risePx = rise !== null ? rise * pxPerMinute : null;
  const setPx = set !== null ? set * pxPerMinute : null;

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

  // sync scroll position when minute changes
  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    ignoreScrollRef.current = true;
    scroller.scrollLeft = minute * pxPerMinute - scroller.clientWidth / 2;
    ignoreScrollRef.current = false;
  }, [minute, pxPerMinute]);

  const handleScroll = () => {
    if (ignoreScrollRef.current) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const newMinute = Math.round((scroller.scrollLeft + scroller.clientWidth / 2) / pxPerMinute);
    cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const d = dateTime.startOf('day').plus({ minutes: newMinute, seconds: dateTime.second });
      onChange(d);
    });
  };

  // build visible ranges
  const ranges: { left: number; width: number }[] = [];
  if (rise !== null && set !== null) {
    if (rise < set) {
      ranges.push({ left: rise * pxPerMinute, width: (set - rise) * pxPerMinute });
    } else {
      ranges.push({ left: 0, width: set * pxPerMinute });
      ranges.push({ left: rise * pxPerMinute, width: (1440 - rise) * pxPerMinute });
    }
  } else if (rise !== null) {
    ranges.push({ left: rise * pxPerMinute, width: (1440 - rise) * pxPerMinute });
  } else if (set !== null) {
    ranges.push({ left: 0, width: set * pxPerMinute });
  }

  return (
    <div id="timeline" className="flex items-center space-x-2 h-full w-full" >
      <button
        id="timeline-prev"
        className="px-2 py-1 rounded"
        style={{ background: colors.navy00, color: colors.ivory }}
        onClick={() => animateMove(-180)}
      >
        &lt;&lt;
      </button>
      <div ref={scrollRef} onScroll={handleScroll} className="relative flex-1 h-full overflow-x-scroll overflow-y-hidden">
        <div className="relative h-full" style={{ width: `${contentWidth}px` }}>
          <TimelineRange minute={minute} onChange={handleRange} />
          <div id="timeline-ruler" className="absolute left-0" style={{ top: '40%', height: '30%', width: `${contentWidth}px` }}>
            {ranges.map((r, idx) => (
              <div
                key={idx}
                id="moon-visible-range"
                className="absolute h-full"
                style={{ left: `${r.left}px`, width: `${r.width}px`, background: colors.highlightIvory, opacity: 0.3 }}
              />
            ))}
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="absolute bottom-0" style={{ left: `${(i / 24) * contentWidth}px` }}>
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
          <div id="timeline-markers" className="absolute left-0" style={{ top: '70%', width: `${contentWidth}px` }}>
            {risePx !== null && riseLabel && (
              <div
                id="rise-marker"
                className="absolute flex flex-col items-center"
                style={{ left: `${risePx}px`, transform: 'translateX(-50%)', color: colors.ivory }}
              >
                <div className="text-2xl">↑</div>
                <div className="text-xs">{riseLabel}</div>
              </div>
            )}
            {setPx !== null && setLabel && (
              <div
                id="set-marker"
                className="absolute flex flex-col items-center"
                style={{ left: `${setPx}px`, transform: 'translateX(-50%)', color: colors.ivory }}
              >
                <div className="text-2xl">↓</div>
                <div className="text-xs">{setLabel}</div>
              </div>
            )}
          </div>
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

