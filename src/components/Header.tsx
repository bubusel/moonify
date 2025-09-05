import React from 'react';
import { colors } from '../constants/colors';
import DatePickerHotkeys from './DatePickerHotkeys';
import LocationControl from './LocationControl';
import TimelineScrollbar from './TimelineScrollbar';

interface Props {
  date: string;
  onDateChange: (d: string) => void;
  minute: number;
  onMinuteChange: (m: number) => void;
}

const Header: React.FC<Props> = ({ date, onDateChange, minute, onMinuteChange }) => {
  return (
    <header
      id="app-header"
      className="p-4 flex flex-col space-y-4"
      style={{ background: colors.navy10 }}
    >
      <div className="flex justify-between items-center">
        <h1 id="app-title" className="text-xl font-bold" style={{ color: colors.ivory }}>
          Moonify
        </h1>
        <DatePickerHotkeys date={date} onChange={onDateChange} />
        <LocationControl />
      </div>
      <TimelineScrollbar date={date} minute={minute} onChange={onMinuteChange} />
    </header>
  );
};

export default Header;
