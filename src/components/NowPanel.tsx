import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import MoonDisc from './MoonDisc';
import { getMoon } from '../lib/astro';
import { clipDeg } from '../constants/config';

interface Props {
  date: string;
  minute: number;
}

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

  const Cx = dim.w / 2;
  const baseDiameter = 64;
  const topMargin = baseDiameter / 2;
  const maxAlt = 90; // assume zenith at 90° for vertical rise

  const mapAltToY = (alt: number) => {
    const scale = (dim.h - topMargin) / maxAlt;
    return dim.h - alt * scale;
  };
  const horizonY = mapAltToY(0);

  const jsNow = dayStart.plus({ minutes: minute }).toJSDate();
  const { position, illumination } = getMoon(jsNow, 0, 0);
  const altDeg = (position.altitude * 180) / Math.PI;
  const visible = altDeg >= -clipDeg;
  const x = Cx;
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
    <div id="now-panel" className="flex flex-col items-center space-y-2 w-[80vw] h-[50vh]">
      <div
        id="moon-canvas"
        ref={canvasRef}
        className="relative w-full h-full overflow-hidden"
      >
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
      <div id="moon-info" className="w-full text-textMuted text-center">
        Altitude: {altDeg.toFixed(2)}° | Phase: {(illumination.phase * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default NowPanel;
