import React from 'react';
import { colors } from '../constants/colors';

interface Props {
  visible: boolean;
  phase: number; // 0..1
}

const MoonDisc: React.FC<Props> = ({ visible, phase }) => {
  if (!visible) return null;
  const lit = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  const dir = phase <= 0.5 ? 'to left' : 'to right';
  const gradient = `linear-gradient(${dir}, ${colors.ivory} ${lit * 100}%, ${colors.navy10} ${lit * 100}%)`;
  return (
    <div
      className="w-32 h-32 rounded-full"
      style={{ background: colors.navy10 }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{ background: gradient }}
      />
    </div>
  );
};

export default MoonDisc;
