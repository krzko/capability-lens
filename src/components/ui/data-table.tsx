"use client";

import { useState, useMemo } from 'react';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => any);
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  // Initialize with default sort by name in ascending order
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((item: T) => any);
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });
  const [filterText, setFilterText] = useState('');

  const handleSort = (key: keyof T | ((item: T) => any)) => {
    setSortConfig((prevSort) => {
      // If clicking on a different column, sort ascending
      if (prevSort.key !== key) {
        return { key, direction: 'asc' };
      }
      // If clicking on the name column when it's descending, go back to ascending
      if (key === 'name' && prevSort.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      // Otherwise toggle between asc/desc
      return { key, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  const sortedData = useMemo(() => {

    return [...data].sort((a, b) => {
      const aValue = typeof sortConfig.key === 'function' 
        ? sortConfig.key(a) 
        : a[sortConfig.key];
      const bValue = typeof sortConfig.key === 'function'
        ? sortConfig.key(b)
        : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;

    return sortedData.filter((item) =>
      columns.some((column) => {
        const value = typeof column.accessor === 'function'
          ? column.accessor(item)
          : item[column.accessor];
        return String(value)
          .toLowerCase()
          .includes(filterText.toLowerCase());
      })
    );
  }, [sortedData, filterText, columns]);

  const getSortIcon = (columnKey: keyof T | ((item: T) => any)) => {
    if (sortConfig?.key !== columnKey) return <ChevronUpDownIcon className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter items..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() =>
                    column.sortable && handleSort(column.accessor)
                  }
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && getSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            {filteredData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                  >
                    {column.render
                      ? column.render(
                          typeof column.accessor === 'function'
                            ? column.accessor(item)
                            : item[column.accessor],
                          item
                        )
                      : typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
