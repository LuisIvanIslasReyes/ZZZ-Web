/**
 * Table Component
 * Componente de tabla reutilizable con paginación y acciones
 */

import { type ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  icon?: ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({
  data,
  columns,
  actions,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No hay datos para mostrar',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
              {actions && actions.length > 0 && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={idx}>
                {columns.map((_, colIdx) => (
                  <td key={colIdx}>
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td>
                    <div className="skeleton h-4 w-20"></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
              {actions && actions.length > 0 && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)} className="text-center py-8 text-base-content/60">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className}>
                {col.label}
              </th>
            ))}
            {actions && actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={col.className}>
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T] ?? '')}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td>
                  <div className="flex gap-2">
                    {actions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        onClick={() => action.onClick(item)}
                        className={action.className || 'btn btn-ghost btn-sm'}
                        title={action.label}
                      >
                        {action.icon || action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
