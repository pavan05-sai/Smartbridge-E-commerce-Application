import React from 'react';

export default function StatCard({ title, value, icon, trend, borderHighlight = 'border-t-2 border-t-accent-blue' }) {
  return (
    <div className={`card-glass ${borderHighlight} rounded-xl p-5 shadow-lg flex flex-col justify-between gap-4`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-borderBlue/30 text-accent-electric">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-bold font-accent text-text-primary tracking-tight">
          {value}
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={trend.startsWith('+') ? 'text-success font-semibold' : 'text-error font-semibold'}>
              {trend}
            </span>
            <span className="text-text-secondary">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
