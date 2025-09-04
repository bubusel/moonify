import React from 'react';
import { colors } from '../constants/colors';
import DatePickerHotkeys from './DatePickerHotkeys';
import LocationControl from './LocationControl';
import TimelineScrollbar from './TimelineScrollbar';

interface Props {
  minute: number;
  onMinuteChange: (m: number) => void;
}

const Header: React.FC<Props> = ({ minute, onMinuteChange }) => {
  return (
    <header className="p-4 flex flex-col space-y-4" style={{ background: colors.navy10 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold" style={{ color: colors.ivory }}>Moonify</h1>
        <DatePickerHotkeys />
        <LocationControl />
      </div>
      <TimelineScrollbar minute={minute} onChange={onMinuteChange} />
    </header>
  );
};

export default Header;
