import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyTransaction } from '../types';
import { TrendingUp } from 'lucide-react';

interface FinancialChartProps {
  data: MonthlyTransaction[];
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600"/> Cashflow Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">6-Month Income vs Expense Trend</p>
         </div>
         <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Income
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Expenses
            </div>
         </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
                tickFormatter={(value) => `${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
            />
            <Area 
                type="monotone" 
                dataKey="expenses" 
                name="Expenses" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};