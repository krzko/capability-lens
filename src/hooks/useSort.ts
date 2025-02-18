'use client';

import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSort<T>(
  items: T[],
  defaultSort?: SortConfig,
  options?: {
    customSort?: Record<string, (a: T, b: T) => number>;
  }
) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(defaultSort);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a: T, b: T) => {
      // Use custom sort function if available
      if (options?.customSort?.[sortConfig.key]) {
        const result = options.customSort[sortConfig.key](a, b);
        // If result is 1 or -1, it's a special case (like zeros), respect the original order
        if (Math.abs(result) === 1) return result;
        // Otherwise apply the sort direction
        return sortConfig.direction === 'asc' ? result : -result;
      }

      // Default sorting logic
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a as any);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b as any);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sortConfig, options?.customSort]);

  const requestSort = (key: string) => {
    setSortConfig((currentConfig) => {
      if (!currentConfig || currentConfig.key !== key) {
        return { key, direction: 'asc' };
      }
      return { key, direction: currentConfig.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  return {
    items: sortedItems,
    sortConfig,
    requestSort,
  };
}
