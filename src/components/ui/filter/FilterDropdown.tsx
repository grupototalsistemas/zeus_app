'use client';
// components/ui/filter/FilterDropdown.tsx
import { ChevronDownIcon, CloseLineIcon } from '@/icons';
import { StatusRegistro } from '@/types/enum';
import { useEffect, useRef, useState } from 'react';

export interface FilterOption {
  label: string;
  value: string | StatusRegistro;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  type: 'single' | 'multiple';
}

export interface FilterDropdownProps {
  filters: FilterConfig[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterKey: string, value: any) => void;
  onClearAll: () => void;
  className?: string;
}

export default function FilterDropdown({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Contar filtros ativos
  const activeFilterCount = Object.values(activeFilters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  }).length;

  const handleSingleFilterChange = (
    filterKey: string,
    value: string | StatusRegistro
  ) => {
    onFilterChange(filterKey, activeFilters[filterKey] === value ? '' : value);
  };

  const handleMultipleFilterChange = (
    filterKey: string,
    value: string | StatusRegistro
  ) => {
    const currentValues = activeFilters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];
    onFilterChange(filterKey, newValues);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botão Filtrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-theme-sm shadow-theme-xs relative inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        {/* <FilterIcon className="h-5 w-5" /> */}
        <svg
          className="fill-white stroke-current dark:fill-gray-800"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path d="M2.29 5.9H17.7" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17.7 14.1H2.29" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M12.08 3.33A2.57 2.57 0 1 1 9.51 5.9a2.57 2.57 0 0 1 2.57-2.57Z"
            strokeWidth="1.5"
          />
          <path
            d="M7.92 11.52a2.57 2.57 0 1 0 2.57 2.57 2.57 2.57 0 0 0-2.57-2.57Z"
            strokeWidth="1.5"
          />
        </svg>
        Filtrar
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
        {/* Badge de contador */}
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-500 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Filtros
            </h3>

            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <CloseLineIcon className="h-4 w-4" />
                Limpar
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {filter.label}
                </label>

                <div className="space-y-2">
                  {filter.options.map((option) => {
                    const isChecked =
                      filter.type === 'single'
                        ? activeFilters[filter.key] === option.value
                        : (activeFilters[filter.key] || []).includes(
                            option.value
                          );

                    return (
                      <label
                        key={String(option.value)}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <input
                          type={filter.type === 'single' ? 'radio' : 'checkbox'}
                          name={
                            filter.type === 'single' ? filter.key : undefined
                          }
                          checked={isChecked}
                          onChange={() => {
                            if (filter.type === 'single') {
                              handleSingleFilterChange(
                                filter.key,
                                option.value
                              );
                            } else {
                              handleMultipleFilterChange(
                                filter.key,
                                option.value
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="flex-1">{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-400">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-600">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
