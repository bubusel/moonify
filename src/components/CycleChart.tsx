import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '../constants/colors';

const sample = Array.from({ length: 10 }, (_, i) => ({ day: i + 1, hours: Math.random() * 10 }));

const CycleChart: React.FC = () => {
  return (
    <div id="cycle-chart" className="w-full h-64" style={{ background: colors.navy10 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sample} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="day" stroke={colors.textMuted} />
          <YAxis stroke={colors.textMuted} />
          <Tooltip wrapperStyle={{ background: colors.navy00, border: 'none' }} />
          <Bar dataKey="hours" fill={colors.psychedelicTeal} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CycleChart;
