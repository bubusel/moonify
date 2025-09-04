import React, { useState } from 'react';
import Header from './Header';
import SkyBackdrop from './SkyBackdrop';
import NowPanel from './NowPanel';
import CycleChart from './CycleChart';

const AppShell: React.FC = () => {
  const now = new Date();
  const [minutes, setMinutes] = useState(now.getHours() * 60 + now.getMinutes());

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SkyBackdrop minute={minutes} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header minute={minutes} onMinuteChange={setMinutes} />
        <main className="flex-1 p-4 space-y-8">
          <NowPanel minute={minutes} />
          <CycleChart />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
