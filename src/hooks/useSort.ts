'use client';

import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSort<T>(items: T[], defaultSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(defaultSort);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a: any, b: any) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig((currentConfig) => {
      if (!currentConfig || currentConfig.key !== key) {
        return { key, direction: 'asc' };
      }
      if (currentConfig.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return undefined;
    });
  };

  return {
    items: sortedItems,
    sortConfig,
    requestSort,
  };
}
