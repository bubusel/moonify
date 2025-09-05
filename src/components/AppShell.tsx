import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { colors } from '../constants/colors';
import SkyBackdrop from './SkyBackdrop';
import NowPanel from './NowPanel';
import TimelineScrollbar from './TimelineScrollbar';
import DatePickerHotkeys from './DatePickerHotkeys';

const AppShell: React.FC = () => {
  const [dateTime, setDateTime] = useState(DateTime.now());
  const minute = dateTime.hour * 60 + dateTime.minute;
  const dateStr = dateTime.toISODate();

  return (
    <div id="app-shell" className="h-screen relative overflow-hidden">
      <SkyBackdrop minute={minute} />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1" />
        <div
          id="main-content"
          className="relative flex items-center justify-center"
          style={{ height: '50vh' }}
        >
          <h1
            id="app-title"
            className="absolute top-0 left-0 text-xl font-bold p-4"
            style={{ color: colors.ivory }}
          >
            Moonify
          </h1>
          <NowPanel date={dateStr} minute={minute} />
        </div>
        <div style={{ height: '10vh' }} className="flex items-center">
          <TimelineScrollbar dateTime={dateTime} onChange={setDateTime} />
        </div>
        <div style={{ height: '10vh' }} className="flex items-center">
          <DatePickerHotkeys dateTime={dateTime} onChange={setDateTime} />
        </div>
      </div>
    </div>
  );
};

export default AppShell;
