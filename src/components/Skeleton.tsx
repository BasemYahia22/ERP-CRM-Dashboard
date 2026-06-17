import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}
        />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex space-x-4 items-center">
        <Skeleton className="h-10 w-1/4 rounded-lg" />
        <Skeleton className="h-10 w-1/6 rounded-lg" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="border border-slate-100 dark:border-slate-805 rounded-xl overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-850 h-11 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-3 p-4">
          <Skeleton count={5} className="h-14 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
