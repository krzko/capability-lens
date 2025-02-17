'use client';

import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  difference: number;
  className?: string;
}

export function TrendIndicator({ difference, className }: TrendIndicatorProps) {
  const getArrow = (diff: number) => {
    if (diff > 0) return '↑';
    if (diff < 0) return '↓';
    return '↔';
  };

  const getColorClass = (diff: number) => {
    if (diff > 0) return 'text-emerald-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <span className={cn('flex items-center gap-1 font-medium', getColorClass(difference), className)}>
      {getArrow(difference)} {Math.abs(difference).toFixed(1)}
    </span>
  );
}
