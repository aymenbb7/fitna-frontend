import React from 'react';

export const LoadingSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-xl ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-bgPurple border border-white/5 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <LoadingSkeleton className="h-6 w-24" />
      <LoadingSkeleton className="h-10 w-10 rounded-lg" />
    </div>
    <LoadingSkeleton className="h-10 w-16 mb-2" />
    <LoadingSkeleton className="h-4 w-32" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4 space-x-reverse">
        <LoadingSkeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);
