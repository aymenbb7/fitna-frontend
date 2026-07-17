import React from 'react';
import { Card } from '../ui/Card';

export const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass = "text-accentGold" }) => {
  return (
    <Card className="hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 font-bold mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-bgDark border border-white/5 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {(trend || trendLabel) && (
        <div className="flex items-center text-sm font-medium">
          {trend && (
            <span className={trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400"}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
          {trendLabel && (
            <span className="text-gray-500 mr-2">{trendLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
};
