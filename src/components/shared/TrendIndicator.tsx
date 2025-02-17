'use client';

import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function TrendIndicator({ value, suffix, className }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const absValue = Math.abs(value);

  const getColorClass = () => {
    if (isPositive) return 'text-emerald-600';
    if (isNeutral) return 'text-gray-500';
    return 'text-red-600';
  };

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-1 text-sm', className)}>
      <span className={cn('inline-flex items-center gap-1', getColorClass())}>
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : isNeutral ? (
          <ArrowRight className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>{absValue}</span>
      </span>
      {suffix && (
        <span className="text-muted-foreground">
          {suffix}
        </span>
      )}
    </span>
  );
}
