'use client';
// components/ui/filter/ViewAllButton.tsx
interface ViewAllButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function ViewAllButton({
  onClick,
  className = '',
  disabled = false,
}: ViewAllButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 ${className}`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
      Ver Todos
    </button>
  );
}

// hooks/useFilter.ts
import { useMemo, useState } from 'react';

export interface UseFilterProps<T> {
  data: T[];
  filterFunctions: Record<string, (item: T, filterValue: any) => boolean>;
}

export function useFilter<T>({ data, filterFunctions }: UseFilterProps<T>) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(activeFilters).every(([filterKey, filterValue]) => {
        // Ignorar filtros vazios
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0) ||
          filterValue === ''
        ) {
          return true;
        }

        const filterFunction = filterFunctions[filterKey];
        return filterFunction ? filterFunction(item, filterValue) : true;
      });
    });
  }, [data, activeFilters, filterFunctions]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const hasActiveFilters = Object.values(activeFilters).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  });

  return {
    filteredData,
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
  };
}
