import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function RevenueChart({ data = [] }) {
  // Custom Tooltip component for dark aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-glass border border-borderBlue/80 p-3 rounded-lg shadow-xl font-accent text-xs">
          <p className="text-text-secondary mb-1">{label}</p>
          <p className="text-accent-electric font-bold text-sm">
            Revenue: ₹{payload[0].value.toFixed(2)}
          </p>
          {payload[1] && (
            <p className="text-success font-bold mt-0.5">
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-glass rounded-xl p-6 border border-borderBlue shadow-lg space-y-4">
      <div>
        <h3 className="text-base font-bold font-heading text-text-primary">Earning Performance</h3>
        <p className="text-xs text-text-secondary">Monthly total revenues and orders received</p>
      </div>

      <div className="h-72 w-full text-xs font-accent">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Blue Gradient definition */}
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.3} vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e3a5f', strokeWidth: 1 }} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#60a5fa"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={1}
              fillOpacity={0}
              strokeDasharray="4 4"
              visible={false} /* Hide in grid but available in tooltip payload */
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
