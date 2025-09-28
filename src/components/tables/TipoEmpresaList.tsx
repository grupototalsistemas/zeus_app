'use client';

import { useEmpresaTipo } from '@/hooks/useEmpresaTipo';
import { MoreDotIcon } from '@/icons';
import { EmpresaTipo } from '@/types/empresaTipo.type';
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

export default function TipoEmpresaList() {
  const router = useRouter();

  // Hook customizado com todas as operações de tipoEmpresa
  const { empresaTipos, loading, error, remove, update, getAll, resetError } =
    useEmpresaTipo();

  // Estados locais (apenas para UI)
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(empresaTipos.length / itemsPerPage);

  // Configuração dos filtros
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
            count: empresaTipos.filter(
              (item) => item.ativo === StatusRegistro.ATIVO
            ).length,
          },
          {
            label: 'Inativo',
            value: StatusRegistro.INATIVO,
            count: empresaTipos.filter(
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
          // Gerar opções dinamicamente baseado nas descrições únicas
          ...Array.from(new Set(empresaTipos.map((item) => item.descricao)))
            .sort()
            .map((desc) => ({
              label: desc,
              value: desc,
              count: empresaTipos.filter((item) => item.descricao === desc)
                .length,
            })),
        ],
      },
    ],
    [empresaTipos]
  );

  // Funções de filtro
  const filterFunctions = {
    status: (item: EmpresaTipo, filterValue: StatusRegistro) => {
      return item.ativo === filterValue;
    },
    descricao: (item: EmpresaTipo, filterValue: string[]) => {
      return filterValue.includes(item.descricao);
    },
  };

  // Hook de filtro
  const {
    filteredData,
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter({
    data: empresaTipos,
    filterFunctions,
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pathname = usePathname();

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  useEffect(() => {
    getAll();
  }, [pathname, getAll]);

  const handleDelete = async (tipoEmpresa: EmpresaTipo) => {
    // Confirmação antes de excluir
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o tipoEmpresa "${tipoEmpresa.descricao}"?\n\nEsta ação não pode ser desfeita.`
    );
    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }
    try {
      await remove(tipoEmpresa.id!);

      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((empresaTipos.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erro ao excluir tipoEmpresa:', error);
      alert('Erro ao excluir o tipoEmpresa. Tente novamente.');
    }
  };

  const handleToggle = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleViewAll = () => {
    clearAllFilters();
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando empresaTipos...
            {loading}
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
              {filteredData.length} de {empresaTipos.length} resultados
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
            {paginatedData.map((tipoEmpresa) => (
              <TableRow key={tipoEmpresa.id}>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {tipoEmpresa.descricao}
                </TableCell>

                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      tipoEmpresa.ativo === StatusRegistro.ATIVO
                        ? 'success'
                        : 'error'
                    }
                  >
                    {tipoEmpresa.ativo === StatusRegistro.ATIVO
                      ? 'Ativo'
                      : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleToggle(tipoEmpresa.id!)}
                      className="dropdown-toggle"
                      disabled={loading}
                    >
                      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>

                    <Dropdown
                      isOpen={openDropdownId === tipoEmpresa.id}
                      onClose={() => setOpenDropdownId(null)}
                      className="w-40 p-2"
                    >
                      <DropdownItem
                        onClick={() =>
                          router.push(
                            `/gerenciar-tipo-empresa/${tipoEmpresa.id}`
                          )
                        }
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Editar
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => handleDelete(tipoEmpresa)}
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
