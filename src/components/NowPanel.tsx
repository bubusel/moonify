import React from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import MoonDisc from './MoonDisc';
import { getMoon } from '../lib/astro';

interface Props {
  date: string;
  minute: number;
}

const NowPanel: React.FC<Props> = ({ date, minute }) => {
  const jsDate = DateTime.fromISO(date)
    .startOf('day')
    .plus({ minutes: minute })
    .toJSDate();
  const { position, illumination } = getMoon(jsDate, 0, 0);
  const visible = position.altitude > 0;
  return (
    <div id="now-panel" className="flex flex-col items-center space-y-2">
      <div id="moon-canvas" className="relative w-full h-48 overflow-hidden">
        <MoonDisc visible={visible} phase={illumination.phase} altitude={position.altitude} />
      </div>
      <div id="moon-info" style={{ color: colors.textMuted }}>
        Altitude: {position.altitude.toFixed(2)} rad | Phase: {(illumination.phase * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default NowPanel;
