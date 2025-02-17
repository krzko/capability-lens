'use client';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MaturityProgressProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MaturityProgress({
  score,
  maxScore = 5,
  size = 'md',
}: MaturityProgressProps) {
  const percentage = (score / maxScore) * 100;
  const roundedScore = Math.round(score * 10) / 10;

  const getColorClass = (score: number) => {
    if (score >= 4) return 'bg-emerald-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <div className={cn('w-full rounded-full bg-gray-200', sizeClasses[size])}>
              <div
                className={cn(
                  'rounded-full transition-all',
                  getColorClass(score),
                  sizeClasses[size]
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-medium">
            {score === 0 ? 'Not Assessed' : `${roundedScore}/5`}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
