import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import MoonDisc from './MoonDisc';
import { getMoon } from '../lib/astro';

interface Props {
  minute: number;
}

const NowPanel: React.FC<Props> = ({ minute }) => {
  const date = DateTime.now().startOf('day').plus({ minutes: minute }).toJSDate();
  const { position, illumination } = getMoon(date, 0, 0);
  const visible = position.altitude > 0;
  return (
    <div className="flex flex-col items-center space-y-2">
      <MoonDisc visible={visible} phase={illumination.phase} />
      <div style={{ color: colors.textMuted }}>
        Altitude: {position.altitude.toFixed(2)} rad | Phase: {(illumination.phase * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default NowPanel;
