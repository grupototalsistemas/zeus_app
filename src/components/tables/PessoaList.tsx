'use client';

import { usePerfil } from '@/hooks/usePerfil';
import { usePessoa } from '@/hooks/usePessoa';
import { ChevronDownIcon, ChevronUpIcon, MoreDotIcon } from '@/icons';
import { PessoaService } from '@/service/pessoa.service';
import { Pessoa, PessoaFisicaResponse } from '@/types/pessoa.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '../common/PageBreadCrumb';
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

export default function PessoaList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { fetchPessoasByEmpresa, pessoaInfo, pessoas } = usePessoa();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const { selectPerfilById } = usePerfil();

  useEffect(() => {
    console.log('Pessoa Info:', pessoaInfo);
    fetchPessoasByEmpresa(pessoaInfo?.id_pessoa_juridica || 0);
  }, []);

  const totalPages = Math.ceil(pessoas.length / itemsPerPage);
  const paginatedData = pessoas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (pessoa: Pessoa) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o/a "${pessoa.nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      const response = await PessoaService.deletePessoa(pessoa.id!);
      console.log(response);

      setOpenDropdownId(null);

      const newTotalPages = Math.ceil((pessoas.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Erro ao excluir tipo:', error);
      alert('Erro ao excluir o tipo. Tente novamente.');
    }
  };

  const handleToggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleToggleExpand = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Listar Pessoas" pageBefore="Pessoas" />
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
                  CPF
                </TableCell>
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
                  Login
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  Documento
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
                paginatedData.map((user: PessoaFisicaResponse) => (
                  <>
                    <TableRow
                      key={user.pessoaFisica.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    >
                      <TableCell className="w-8">
                        <button
                          onClick={() =>
                            handleToggleExpand(String(user.pessoaFisica.id))
                          }
                          className="p-1 text-gray-500 hover:text-gray-800"
                        >
                          {expandedRowId === String(user.pessoaFisica.id) ? (
                            <ChevronUpIcon size={18} />
                          ) : (
                            <ChevronDownIcon size={18} />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {user.pessoaFisica.cpf}
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {user.pessoaFisica.nome_social ||
                          user.pessoaFisica.nome_registro}
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {user.pessoaFisica.pessoasUsuarios
                          .map((usuarios) => usuarios.nome_login)
                          .join(', ')}
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {user.pessoaFisica.pessoasUsuarios
                          .map((usuarios) => usuarios.login)
                          .join(', ')}
                      </TableCell>
                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {user.pessoaFisica.doc_numero || 'N/A'}
                      </TableCell>

                      <TableCell>
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              handleToggleDropdown(String(user.pessoaFisica.id))
                            }
                            className="dropdown-toggle"
                          >
                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                          </button>
                          <Dropdown
                            isOpen={
                              openDropdownId === String(user.pessoaFisica.id)
                            }
                            onClose={() => setOpenDropdownId(null)}
                            className="w-40 p-2"
                          >
                            <DropdownItem
                              onClick={() =>
                                router.push(
                                  `/gerenciar-pessoa/${user.pessoaFisica.id}`
                                )
                              }
                            >
                              Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => handleDelete(user)}>
                              Deletar
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedRowId === String(user.pessoaFisica.id) && (
                      <TableRow>
                        <TableCell
                          key={user.pessoaFisica.id}
                          colSpan={6}
                          className="bg-gray-50 dark:bg-gray-900/30"
                        >
                          <div className="space-y-2 p-4 text-sm text-gray-700 dark:text-gray-300">
                            <p>
                              <strong>Login:&nbsp;</strong>
                              {user.pessoaFisica.pessoasUsuarios
                                .map((usuarios) => usuarios.nome_login)
                                .join(', ')}
                            </p>
                            <p>
                              <strong>Perfil:&nbsp;</strong>{' '}
                              {user.id_pessoa_juridica_perfil}
                            </p>
                            <p>
                              <strong>Gênero:&nbsp;</strong>{' '}
                              {user.pessoaFisica.id_pessoa_genero}
                            </p>
                            <p>
                              <strong>Ativo:&nbsp;</strong>{' '}
                              {user.pessoaFisica.situacao === 1 ? 'Sim' : 'Não'}
                            </p>
                            <p>
                              <strong>Criado em:&nbsp;</strong>{' '}
                              {new Date(user.createdAt || '').toLocaleString()}
                            </p>
                            {user.motivo && (
                              <p>
                                <strong>Motivo:&nbsp;</strong> {user.motivo}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    Nenhum usuário encontrado
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
    </>
  );
}
