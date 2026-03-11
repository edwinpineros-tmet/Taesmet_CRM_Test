import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserData {
  usuario: string;
  [estado: string]: number | string;
}

interface UserStackedBarChartProps {
  data: UserData[];
  estados: string[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function UserStackedBarChart({ data, estados }: UserStackedBarChartProps) {
  return (
    <div style={{ width: '100%', height: 350 }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="usuario" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '0.875rem', paddingTop: '10px' }} />
            {estados.map((estado, index) => (
              <Bar 
                key={estado} 
                dataKey={estado} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]} 
                radius={index === estados.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
          No hay datos para mostrar
        </div>
      )}
    </div>
  );
}
