import React from 'react';
import { colors } from '../constants/colors';

interface Props {
  visible: boolean;
  phase: number; // 0..1
  x: number;
  y: number;
  diameter: number;
  color: string;
  altDeg: number;
  horizonY: number;
  clipDeg: number;
}

const MoonDisc: React.FC<Props> = ({
  visible,
  phase,
  x,
  y,
  diameter,
  color,
  altDeg,
  horizonY,
  clipDeg,
}) => {
  if (!visible) return null;

  const lit = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  const dir = phase <= 0.5 ? 'to left' : 'to right';
  const gradient = `linear-gradient(${dir}, ${color} ${lit * 100}%, ${colors.navy10} ${lit * 100}%)`;

  const top = y - diameter / 2;
  const left = x - diameter / 2;

  const style: React.CSSProperties = {
    position: 'absolute',
    width: `${diameter}px`,
    height: `${diameter}px`,
    left: `${left}px`,
    top: `${top}px`,
    background: colors.navy10,
    borderRadius: '50%',
    transition: 'all 0.2s',
  };

  if (altDeg < 0 && altDeg >= -clipDeg) {
    const horizonInDisc = horizonY - top;
    const mask = `linear-gradient(to bottom, black ${horizonInDisc}px, transparent ${horizonInDisc}px)`;
    style.WebkitMaskImage = mask;
    style.maskImage = mask;
  }

  return (
    <div id="moon-disc" style={style}>
      <div
        className="w-full h-full rounded-full"
        style={{ background: gradient }}
      />
    </div>
  );
};

export default MoonDisc;

