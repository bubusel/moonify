import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import MoonDisc from './MoonDisc';
import { getMoon, toCompass } from '../lib/astro';
import { clipDeg } from '../constants/config';

interface Props {
  date: string;
  minute: number;
}
const sampleStep = 5; // minutes

function hexToHsl(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToString({ h, s, l }: { h: number; s: number; l: number }) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const NowPanel: React.FC<Props> = ({ date, minute }) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [dim, setDim] = React.useState({ w: 0, h: 0 });

  React.useLayoutEffect(() => {
    if (canvasRef.current) {
      setDim({ w: canvasRef.current.clientWidth, h: canvasRef.current.clientHeight });
    }
  }, []);

  const dayStart = React.useMemo(() => DateTime.fromISO(date).startOf('day'), [date]);

  const samples = React.useMemo(() => {
    const arr: { t: number; alt: number; az: number }[] = [];
    for (let t = 0; t < 1440; t += sampleStep) {
      const jsDate = dayStart.plus({ minutes: t }).toJSDate();
      const { position } = getMoon(jsDate, 0, 0);
      arr.push({ t, alt: (position.altitude * 180) / Math.PI, az: (position.azimuth * 180) / Math.PI });
    }
    return arr;
  }, [dayStart]);

  let tRise = 0;
  let tSet = 1440;
  let maxAlt = -90;

  samples.forEach((s, i) => {
    if (s.alt > maxAlt) {
      maxAlt = s.alt;
    }
    if (i > 0) {
      const prev = samples[i - 1];
      if (prev.alt < 0 && s.alt >= 0) tRise = s.t;
      if (prev.alt >= 0 && s.alt < 0 && tSet === 1440) tSet = prev.t;
    }
  });

  const sampleMap = new Map(samples.map((s) => [s.t, s]));
  const azRise = sampleMap.get(tRise)?.az ?? 0;
  const azSet = sampleMap.get(tSet)?.az ?? 0;

  const Wmax = dim.w * 0.9;
  const Wmin = dim.w * 0.3;
  const visibleSpan = tSet - tRise;
  const L = Math.min(Wmax, Math.max(Wmin, (visibleSpan / 1440) * Wmax));
  const Cx = dim.w / 2;

  const baseDiameter = 64;
  const topMargin = baseDiameter / 2;

  const mapAltToY = (alt: number) => {
    const scale = (dim.h - topMargin) / maxAlt;
    return dim.h - alt * scale;
  };

  const xAt = (t: number) => {
    const ratio = (t - tRise) / (tSet - tRise);
    return Cx - L / 2 + ratio * L;
  };
  const horizonY = mapAltToY(0);

  const pathData = React.useMemo(() => {
    const pts = samples
      .filter((s) => s.t >= tRise && s.t <= tSet)
      .map((s) => `${xAt(s.t)},${mapAltToY(s.alt)}`);
    return pts.length ? `M ${pts.join(' L ')}` : '';
  }, [samples, tRise, tSet, dim.w, dim.h]);

  const jsNow = dayStart.plus({ minutes: minute }).toJSDate();
  const { position, illumination } = getMoon(jsNow, 0, 0);
  const altDeg = (position.altitude * 180) / Math.PI;
  const visible = altDeg >= -clipDeg;
  const x = xAt(minute);
  const y = mapAltToY(altDeg);

  const scale = 1 - 0.25 * Math.min(Math.max(altDeg / maxAlt, 0), 1);
  const diameter = Math.max(0.05 * Math.min(dim.w, dim.h), baseDiameter * scale);

  const tAlt = Math.min(Math.max(altDeg / maxAlt, 0), 1);
  const hslYellow = hexToHsl(colors.moonYellow);
  const hslIvory = hexToHsl(colors.moonIvory);
  const hslSnow = hexToHsl(colors.moonSnow);
  let colorHsl;
  if (tAlt < 0.5) {
    const tt = tAlt / 0.5;
    colorHsl = {
      h: lerp(hslYellow.h, hslIvory.h, tt),
      s: lerp(hslYellow.s, hslIvory.s, tt),
      l: lerp(hslYellow.l, hslIvory.l, tt),
    };
  } else {
    const tt = (tAlt - 0.5) / 0.5;
    colorHsl = {
      h: lerp(hslIvory.h, hslSnow.h, tt),
      s: lerp(hslIvory.s, hslSnow.s, tt),
      l: lerp(hslIvory.l, hslSnow.l, tt),
    };
  }
  const moonColor = hslToString(colorHsl);

  return (
    <div id="now-panel" className="flex flex-col items-center space-y-2">
      <div
        id="moon-canvas"
        ref={canvasRef}
        className="relative w-full h-48 overflow-hidden"
      >
        <svg className="absolute inset-0 w-full h-full" fill="none">
          <path d={pathData} stroke={colors.gridLine} strokeWidth={1} />
        </svg>
        <MoonDisc
          visible={visible}
          phase={illumination.phase}
          x={x}
          y={y}
          diameter={diameter}
          color={moonColor}
          altDeg={altDeg}
          horizonY={horizonY}
          clipDeg={clipDeg}
        />
      </div>
      <div id="moon-info" className="relative w-full" style={{ color: colors.textMuted }}>
        <div
          className="absolute text-xs"
          style={{ left: `${xAt(tRise)}px`, top: 0, transform: 'translateX(-50%)' }}
        >
          {toCompass(azRise)}
        </div>
        <div
          className="absolute text-xs"
          style={{ left: `${xAt(tSet)}px`, top: 0, transform: 'translateX(-50%)' }}
        >
          {toCompass(azSet)}
        </div>
        <div className="text-center">
          Altitude: {altDeg.toFixed(2)}° | Phase: {(illumination.phase * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default NowPanel;
