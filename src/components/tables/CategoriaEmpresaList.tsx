'use client';

import { MoreDotIcon } from '@/icons';

import { useEmpresaCategoria } from '@/hooks/useEmpresaCategoria';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import { StatusRegistro } from '@/types/enum';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Badge from '../ui/badge/Badge';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import FilterDropdown, { FilterConfig } from '../ui/filter/FilterDropdown';
import { useFilter, ViewAllButton } from '../ui/filter/ViewAllButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Pagination from './Pagination';

export default function CategoriaEmpresaList() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const { empresaCategorias, getAll, error, loading, resetError, remove } =
    useEmpresaCategoria();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(empresaCategorias.length / itemsPerPage);

  // Configuração dos filtros - usando useMemo para evitar recriação desnecessária
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        type: 'single',
        options: [
          {
            label: 'Ativo',
            value: StatusRegistro.ATIVO,
            count: empresaCategorias.filter(
              (item) => item.ativo === StatusRegistro.ATIVO
            ).length,
          },
          {
            label: 'Inativo',
            value: StatusRegistro.INATIVO,
            count: empresaCategorias.filter(
              (item) => item.ativo === StatusRegistro.INATIVO
            ).length,
          },
        ],
      },
      {
        key: 'descricao',
        label: 'Descrição',
        type: 'multiple',
        options: [
          ...Array.from(
            new Set(empresaCategorias.map((item) => item.descricao))
          )
            .sort()
            .map((desc) => ({
              label: desc,
              value: desc,
              count: empresaCategorias.filter((item) => item.descricao === desc)
                .length,
            })),
        ],
      },
    ],
    [empresaCategorias]
  );

  // Funções de filtro - usando useMemo para estabilidade
  const filterFunctions = useMemo(
    () => ({
      status: (item: EmpresaCategoria, filterValue: StatusRegistro) => {
        return item.ativo === filterValue;
      },
      descricao: (item: EmpresaCategoria, filterValue: string[]) => {
        return filterValue.includes(item.descricao);
      },
    }),
    []
  );

  // Hook de filtro - SEMPRE chamado, independente do estado
  const {
    filteredData,
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter({
    data: empresaCategorias || [], // Garantir que sempre há um array
    filterFunctions,
  });

  // Effects - sempre executados
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  useEffect(() => {
    if (pathname) {
      getAll();
    }
  }, [pathname, getAll]);

  // Calculations - sempre executados

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers

  const handleDelete = async (empresaCategoria: EmpresaCategoria) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o/a "${empresaCategoria.descricao}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      await remove(empresaCategoria.id!);
      setOpenDropdownId(null);

      const newTotalPages = Math.ceil(
        (empresaCategorias.length - 1) / itemsPerPage
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir a categoria. Tente novamente.');
    }
  };

  const handleToggle = (id: number) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleViewAll = () => {
    clearAllFilters();
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando categorias de empresas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <div className="space-x-2">
              <button onClick={getAll} className="underline hover:no-underline">
                Tentar novamente
              </button>
              <button
                onClick={resetError}
                className="underline hover:no-underline"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Tipos Cadastrados
          </h3>
          {hasActiveFilters && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredData.length} de {empresaCategorias.length} resultados
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <FilterDropdown
            filters={filterConfigs}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
          />

          <ViewAllButton onClick={handleViewAll} disabled={!hasActiveFilters} />
        </div>
      </div>

      <div className="flex max-w-full justify-around">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Descrição
              </TableCell>

              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((categoriaEmpresa) => (
              <TableRow key={categoriaEmpresa.id}>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {categoriaEmpresa.descricao}
                </TableCell>

                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      categoriaEmpresa.ativo === StatusRegistro.ATIVO
                        ? 'success'
                        : 'error'
                    }
                  >
                    {categoriaEmpresa.ativo === StatusRegistro.ATIVO
                      ? 'Ativo'
                      : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleToggle(categoriaEmpresa.id!)}
                      className="dropdown-toggle"
                      disabled={loading}
                    >
                      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>

                    <Dropdown
                      isOpen={openDropdownId === categoriaEmpresa.id}
                      onClose={() => setOpenDropdownId(null)}
                      className="w-40 p-2"
                    >
                      <DropdownItem
                        onClick={() =>
                          router.push(
                            `/gerenciar-categoria/${categoriaEmpresa.id}`
                          )
                        }
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Editar
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => handleDelete(categoriaEmpresa)}
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Deletar
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  {...{ colSpan: 3 }}
                  className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                >
                  {hasActiveFilters
                    ? 'Nenhum resultado encontrado para os filtros aplicados'
                    : 'Nenhuma Tipo de Empresa encontrado'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
