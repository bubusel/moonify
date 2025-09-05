import React, { useState } from 'react';
import { DateTime } from 'luxon';
import Header from './Header';
import SkyBackdrop from './SkyBackdrop';
import NowPanel from './NowPanel';
import CycleChart from './CycleChart';

const AppShell: React.FC = () => {
  const now = DateTime.now();
  const [date, setDate] = useState(now.toISODate());
  const [minutes, setMinutes] = useState(now.hour * 60 + now.minute);

  return (
    <div id="app-shell" className="min-h-screen relative overflow-hidden">
      <SkyBackdrop minute={minutes} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          date={date}
          onDateChange={setDate}
          minute={minutes}
          onMinuteChange={setMinutes}
        />
        <main id="main-content" className="flex-1 p-4 space-y-8">
          <NowPanel date={date} minute={minutes} />
          <CycleChart />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
