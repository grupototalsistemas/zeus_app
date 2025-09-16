'use client';

import { ChevronDownIcon, ChevronUpIcon, MoreDotIcon } from '@/icons';
import { EmpresaService } from '@/service/empresa.service';
import { RootState } from '@/store/rootReducer';
import { setEmpresas } from '@/store/slices/empresaSlice';
import { Empresa } from '@/types/empresa.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

export default function EmpresaList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { empresas } = useSelector((state: RootState) => state.empresa);
  const dispatch = useDispatch();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await EmpresaService.getEmpresas();
        dispatch(setEmpresas(response));
      } catch (error) {
        console.error('Error fetching empresas:', error);
      }
    };
    empresas.length === 0 && fetchEmpresas();
  }, []);

  const totalPages = Math.ceil(empresas.length / itemsPerPage);
  const paginatedData = empresas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (empresa: Empresa) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a empresa "${empresa.nomeFantasia}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      const response = await EmpresaService.deleteEmpresa(empresa.id!);
      console.log(response);

      setOpenDropdownId(null);

      const newTotalPages = Math.ceil((empresas.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      alert('Erro ao excluir a empresa. Tente novamente.');
    }
  };

  const handleToggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

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
    if (empresa.ativo === false) {
      return { color: 'error', text: 'Inativa' };
    }
    if (empresa.tipo?.descricao === 'MATRIZ') {
      return { color: 'success', text: 'Matriz' };
    }
    if (empresa.tipo?.descricao === 'FILIAL') {
      return { color: 'info', text: 'Filial' };
    }
    return { color: 'warning', text: 'Ativa' };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
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
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                CNPJ
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
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
            {paginatedData.length > 0 &&
              paginatedData.map((empresa: Empresa) => {
                const statusInfo = getStatusBadge(empresa);
                return (
                  <>
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
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {formatCNPJ(empresa.cnpj)}
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {empresa.cidade && empresa.estado
                          ? `${empresa.cidade}/${empresa.estado}`
                          : empresa.cidade || empresa.estado || '-'}
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        <Badge size="sm" color={statusInfo.color as any}>
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              handleToggleDropdown(String(empresa.id))
                            }
                            className="dropdown-toggle"
                          >
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                          </button>
                          <Dropdown
                            isOpen={openDropdownId === String(empresa.id)}
                            onClose={() => setOpenDropdownId(null)}
                            className="w-40 p-2"
                          >
                            <DropdownItem
                              onClick={() =>
                                router.push(`/editar-empresa/${empresa.id}`)
                              }
                            >
                              Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => handleDelete(empresa)}>
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
                                  <strong>Número:</strong>{' '}
                                  {empresa.numero || '-'}
                                </p>
                                <p>
                                  <strong>Complemento:</strong>{' '}
                                  {empresa.complemento || '-'}
                                </p>
                                <p>
                                  <strong>Bairro:</strong>{' '}
                                  {empresa.bairro || '-'}
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
                                    {new Date(
                                      empresa.updatedAt
                                    ).toLocaleString()}
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
                  </>
                );
              })}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                >
                  Nenhuma empresa encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
