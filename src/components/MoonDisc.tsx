import React from 'react';
import { colors } from '../constants/colors';

interface Props {
  visible: boolean;
  phase: number; // 0..1
  altitude: number; // radians
}

const MoonDisc: React.FC<Props> = ({ visible, phase, altitude }) => {
  if (!visible) return null;
  const lit = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  const dir = phase <= 0.5 ? 'to left' : 'to right';
  const gradient = `linear-gradient(${dir}, ${colors.ivory} ${lit * 100}%, ${colors.navy10} ${lit * 100}%)`;
  const size = 64; // px
  const canvasHeight = 192; // must match NowPanel canvas height
  const top = ((Math.PI / 2 - altitude) / (Math.PI / 2)) * (canvasHeight - size);
  return (
    <div
      id="moon-disc"
      className="absolute w-16 h-16 rounded-full transition-all duration-200"
      style={{ top: `${top}px`, left: '50%', transform: 'translateX(-50%)', background: colors.navy10 }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{ background: gradient }}
      />
    </div>
  );
};

export default MoonDisc;
