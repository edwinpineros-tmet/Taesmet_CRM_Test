import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ClientData {
  cliente: string;
  montoTotal: number;
  [estado: string]: number | string;
}

interface ClientStackedBarChartProps {
  data: ClientData[];
  estados: string[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedMonto = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(data.montoTotal);
    
    return (
      <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{label}</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Monto Total: <span style={{ color: '#10b981', fontWeight: 600 }}>{formattedMonto}</span></p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '8px' }}></span>
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ClientStackedBarChart({ data, estados }: ClientStackedBarChartProps) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis 
              type="category" 
              dataKey="cliente" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} 
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '0.875rem', paddingTop: '10px' }} />
            {estados.map((estado, index) => (
              <Bar 
                key={estado} 
                dataKey={estado} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]} 
                radius={index === estados.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} 
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
