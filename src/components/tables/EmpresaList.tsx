'use client';

import { useEmpresa } from '@/hooks/useEmpresa';
import { ChevronDownIcon, ChevronUpIcon, MoreDotIcon } from '@/icons';
import { Empresa } from '@/types/empresa.type';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Badge from '../ui/badge/Badge';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Pagination from './Pagination';

import { StatusRegistro } from '@/types/enum';

import FilterDropdown, { FilterConfig } from '../ui/filter/FilterDropdown';
import { useFilter, ViewAllButton } from '../ui/filter/ViewAllButton';

export default function EmpresaList() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const {
    empresas,
    getAllEmpresas,
    error,
    loading,
    resetError,
    removeEmpresa,
  } = useEmpresa();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(empresas.length / itemsPerPage);

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
            count: empresas.filter(
              (item) => item.ativo === StatusRegistro.ATIVO
            ).length,
          },
          {
            label: 'Inativo',
            value: StatusRegistro.INATIVO,
            count: empresas.filter(
              (item) => item.ativo === StatusRegistro.INATIVO
            ).length,
          },
        ],
      },
      // {
      //   key: 'nome',
      //   label: 'Nome',
      //   type: 'multiple',
      //   options: [
      //     ...Array.from(new Set(empresas.map((item) => item.nomeFantasia)))
      //       .sort()
      //       .map((desc) => ({
      //         label: desc,
      //         value: desc,
      //         count: empresas.filter((item) => item.nomeFantasia === desc)
      //           .length,
      //       })),
      //   ],
      // },
    ],
    [empresas]
  );

  // Funções de filtro - usando useMemo para estabilidade
  const filterFunctions = useMemo(
    () => ({
      status: (item: Empresa, filterValue: StatusRegistro) => {
        return item.ativo === filterValue;
      },
      descricao: (item: Empresa, filterValue: string[]) => {
        return filterValue.includes(item.nomeFantasia);
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
    data: empresas || [], // Garantir que sempre há um array
    filterFunctions,
  });

  // Effects - sempre executados
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  useEffect(() => {
    if (pathname) {
      getAllEmpresas();
    }
  }, [pathname, getAllEmpresas]);

  // Calculations - sempre executados

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers

  const handleDelete = async (empresa: Empresa) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o/a "${empresa.nomeFantasia}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      await removeEmpresa(empresa.id!);
      setOpenDropdownId(null);

      const newTotalPages = Math.ceil((empresas.length - 1) / itemsPerPage);
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

  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return '-';
    const cleaned = cnpj.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
    return cnpj;
  };

  const getStatusBadge = (empresa: any) => {
    // Assumindo que existe um campo ativo ou status
    if (empresa.ativo === 'INATIVO') {
      return { color: 'error', text: 'Inativa' };
    }
    if (empresa.tipo?.descricao === 'MATRIZ') {
      return { color: 'success', text: 'Matriz' };
    }
    if (empresa.tipo?.descricao === 'FILIAL') {
      return { color: 'info', text: 'Filial' };
    }
    return { color: 'success', text: 'Ativa' };
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
              <button
                onClick={getAllEmpresas}
                className="underline hover:no-underline"
              >
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
            Listar Empresas
          </h3>
          {hasActiveFilters && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filteredData.length} de {empresas.length} resultados
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
                {''}
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Nome Fantasia
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                CNPJ
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Cidade/Estado
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
            {paginatedData.map((empresa, index) => (
              <Fragment key={index}>
                <TableRow key={empresa.id || empresa.cnpj}>
                  <TableCell className="w-8">
                    <button
                      onClick={() =>
                        handleToggleExpand(String(empresa.id) || '')
                      }
                      className="p-1 text-gray-500 hover:text-gray-800"
                    >
                      {expandedRowId === String(empresa.id) ? (
                        <ChevronUpIcon size={18} />
                      ) : (
                        <ChevronDownIcon size={18} />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {empresa.nomeFantasia}
                      </div>
                      {empresa.codigo && (
                        <div className="text-xs text-gray-500">
                          Código: {empresa.codigo}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {formatCNPJ(empresa.cnpj)}
                  </TableCell>
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {empresa.cidade && empresa.estado
                      ? `${empresa.cidade}/${empresa.estado}`
                      : empresa.cidade || empresa.estado || '-'}
                  </TableCell>
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getStatusBadge(empresa).color as any}
                    >
                      {getStatusBadge(empresa).text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="relative inline-block">
                      <button
                        onClick={() => handleToggle(empresa.id!)}
                        className="dropdown-toggle"
                        disabled={loading}
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>

                      <Dropdown
                        isOpen={openDropdownId === empresa.id}
                        onClose={() => setOpenDropdownId(null)}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onClick={() =>
                            router.push(`/gerenciar-categoria/${empresa.id}`)
                          }
                          className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Editar
                        </DropdownItem>

                        <DropdownItem
                          onClick={() => handleDelete(empresa)}
                          className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Deletar
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRowId === String(empresa.id) && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="bg-gray-50 dark:bg-gray-900/30"
                    >
                      <div className="space-y-3 p-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              Informações Gerais
                            </h4>
                            <p>
                              <strong>Razão Social:</strong>{' '}
                              {empresa.razaoSocial}
                            </p>
                            <p>
                              <strong>Tipo:</strong> {empresa.tipoId || '-'}
                            </p>
                            <p>
                              <strong>Categoria:</strong>{' '}
                              {empresa.categoriaId || '-'}
                            </p>
                            <p>
                              <strong>Empresa Pai:</strong>{' '}
                              {empresa.parentId || 'Matriz'}
                            </p>
                          </div>

                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              Endereço
                            </h4>
                            <p>
                              <strong>Logradouro:</strong>{' '}
                              {empresa.logradouro || '-'}
                            </p>
                            <p>
                              <strong>Endereço:</strong>{' '}
                              {empresa.endereco || '-'}
                            </p>
                            <p>
                              <strong>Número:</strong> {empresa.numero || '-'}
                            </p>
                            <p>
                              <strong>Complemento:</strong>{' '}
                              {empresa.complemento || '-'}
                            </p>
                            <p>
                              <strong>Bairro:</strong> {empresa.bairro || '-'}
                            </p>
                            <p>
                              <strong>CEP:</strong> {empresa.cep || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-2 md:grid-cols-2 dark:border-gray-700">
                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              Contato
                            </h4>
                            <p>
                              <strong>Telefone:</strong>{' '}
                              {empresa.contato || '-'}
                            </p>
                            <p>
                              <strong>Email:</strong> {empresa.email || '-'}
                            </p>
                          </div>

                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              Datas
                            </h4>
                            <p>
                              <strong>Criado em:</strong>{' '}
                              {new Date(
                                empresa.createdAt || ''
                              ).toLocaleString()}
                            </p>
                            {empresa.updatedAt && (
                              <p>
                                <strong>Atualizado em:</strong>{' '}
                                {new Date(empresa.updatedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {empresa.observacao && (
                          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              Observações
                            </h4>
                            <p>{empresa.observacao}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
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
