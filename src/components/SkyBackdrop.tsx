import React from 'react';
import { skyGradient } from '../lib/sky';

interface Props {
  minute: number;
}

const SkyBackdrop: React.FC<Props> = ({ minute }) => {
  return (
    <div
      className="absolute inset-0 -z-10 transition-colors duration-500"
      style={{ background: skyGradient(minute) }}
    />
  );
};

export default SkyBackdrop;
