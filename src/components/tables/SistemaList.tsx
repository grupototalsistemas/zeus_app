'use client';

import { useEmpresa } from '@/hooks/useEmpresa';
import { useSistema } from '@/hooks/useSistema';
import { MoreDotIcon } from '@/icons';
import { StatusRegistro } from '@/types/enum';
import { Sistema } from '@/types/sistemas.type';
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

export default function SistemaList() {
  const router = useRouter();

  // Hook customizado com todas as operações de sistema
  const { sistemas, loading, error, getAll, remove, resetError } = useSistema();
  const { findById } = useEmpresa();

  // Estados locais (apenas para UI)
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sistemas.length / itemsPerPage);

  const pathname = usePathname();

  useEffect(() => {
    getAll();
  }, [getAll, pathname]);

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
            count: sistemas.filter(
              (item) => item.ativo === StatusRegistro.ATIVO
            ).length,
          },
          {
            label: 'Inativo',
            value: StatusRegistro.INATIVO,
            count: sistemas.filter(
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
          ...Array.from(new Set(sistemas.map((item) => item.descricao)))
            .sort()
            .map((desc) => ({
              label: desc,
              value: desc,
              count: sistemas.filter((item) => item.descricao === desc).length,
            })),
        ],
      },
      {
        key: 'nome',
        label: 'Nome',
        type: 'multiple',
        options: [
          // Gerar opções dinamicamente baseado nos nomes únicos
          ...Array.from(new Set(sistemas.map((item) => item.nome)))
            .sort()
            .map((nome) => ({
              label: nome,
              value: nome,
              count: sistemas.filter((item) => item.nome === nome).length,
            })),
        ],
      },
      // Adicionar mais configurações de filtro conforme necessário
      {
        key: 'empresa',
        label: 'Empresa',
        type: 'multiple',
        options: [
          // Gerar opções dinamicamente baseado nas empresas únicas
          ...Array.from(new Set(sistemas.map((item) => String(item.empresaId))))
            .filter((nome): nome is string => !!nome) // Filtrar valores nulos ou indefinidos
            .sort()
            .map((nome) => ({
              label: nome,
              value: nome,
              count: sistemas.filter(
                (item) => item.empresaId?.toString() === nome
              ).length,
            })),
        ],
      },
    ],
    [sistemas]
  );

  // Funções de filtro
  const filterFunctions = {
    status: (item: Sistema, filterValue: StatusRegistro) => {
      return item.ativo === filterValue;
    },
    descricao: (item: Sistema, filterValue: string[]) => {
      return filterValue.includes(item.descricao);
    },
    nome: (item: Sistema, filterValue: string[]) =>
      filterValue.includes(item.nome),
    empresa: (item: Sistema, filterValue: string[]) =>
      filterValue.includes(String(item.empresaId)),
  };

  // Hook de filtro
  const {
    filteredData,
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter({
    data: sistemas,
    filterFunctions,
  });

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (sistema: Sistema) => {
    // Confirmação antes de excluir
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o sistema "${sistema.nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }

    try {
      await remove(sistema.id!);

      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((sistemas.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      console.log('Prioridade excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir sistema:', error);
      alert('Erro ao excluir o sistema. Tente novamente.');
    }
  };
  const handleViewAll = () => {
    clearAllFilters();
  };

  const handleToggle = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  if (loading && sistemas.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando sistemas...
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
            Sistemas Cadastrados
          </h3>
          {hasActiveFilters && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredData.length} de {sistemas.length} resultados
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
      <div className="max-w-full">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Nome
              </TableCell>
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
                Empresa
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
            {paginatedData.map((sistema) => (
              <TableRow key={sistema.id}>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {sistema.nome}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {sistema.descricao}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {sistema.empresaId
                    ? findById(sistema.empresaId)?.nomeFantasia ||
                      findById(sistema.empresaId)?.razaoSocial
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      sistema.ativo === StatusRegistro.ATIVO
                        ? 'success'
                        : 'error'
                    }
                  >
                    {sistema.ativo === StatusRegistro.ATIVO
                      ? 'Ativo'
                      : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleToggle(sistema.id!)}
                      className="dropdown-toggle"
                      disabled={loading}
                    >
                      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>

                    <Dropdown
                      isOpen={openDropdownId === sistema.id}
                      onClose={() => setOpenDropdownId(null)}
                      className="w-40 p-2"
                    >
                      <DropdownItem
                        onClick={() =>
                          router.push(`/gerenciar-sistema/${sistema.id}`)
                        }
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Editar
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => handleDelete(sistema)}
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Deletar
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sistemas.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  {...{ colSpan: 3 }}
                  className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                >
                  Nenhuma função encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {sistemas.length > 0 && (
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
