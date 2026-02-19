import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyTransaction } from '../types';

interface FinancialChartProps {
  data: MonthlyTransaction[];
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">6-Month Cashflow Analysis</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `₹${value/1000}k`}/>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
          />
          <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};