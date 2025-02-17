'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  score: number;
  className?: string;
}

export function StatusBadge({ score, className }: StatusBadgeProps) {
  const getStatus = (score: number) => {
    if (score >= 4) return { label: 'High', variant: 'success' };
    if (score >= 3) return { label: 'Medium', variant: 'warning' };
    return { label: 'Low', variant: 'destructive' };
  };

  const status = getStatus(score);

  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80',
    warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80',
    destructive: 'bg-red-100 text-red-700 hover:bg-red-100/80',
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium',
        variantStyles[status.variant as keyof typeof variantStyles],
        className
      )}
    >
      {status.label}
    </Badge>
  );
}
