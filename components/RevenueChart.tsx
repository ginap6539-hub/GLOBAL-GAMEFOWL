
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Min Bettors/Fight', value: 1000000 },
  { name: 'Bets/Fight ($)', value: 10000000 },
  { name: 'Bets/Day ($)', value: 2500000000 },
  { name: 'Gross Profit/Day ($)', value: 250000000 },
];

const RevenueChart: React.FC = () => {
  return (
    <div className="h-[400px] w-full bg-zinc-900/50 p-6 rounded-2xl border border-white/5 shadow-2xl">
      <h3 className="text-xl font-oswald font-bold mb-6 text-red-500 uppercase tracking-wider text-center">Daily Growth Projection</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#666" fontSize={10} interval={0} />
          <YAxis stroke="#666" fontSize={10} tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #444' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 3 ? '#ef4444' : '#ffffff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
