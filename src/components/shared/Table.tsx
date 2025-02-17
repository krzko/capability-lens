import { FC, ReactNode } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const Table = <T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={clsx(
                  'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900',
                  index === 0 ? 'sm:pl-6' : ''
                )}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, rowIndex) => (
            <tr key={item.id}>
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={clsx(
                    'whitespace-nowrap py-4 pl-4 pr-3 text-sm',
                    colIndex === 0 ? 'font-medium text-gray-900 sm:pl-6' : 'text-gray-500'
                  )}
                >
                  {column.render
                    ? column.render(item[column.accessor])
                    : (item[column.accessor] as string)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Edit</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Delete</span>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
