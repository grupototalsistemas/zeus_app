'use client';

import { ChevronDownIcon, ChevronUpIcon, MoreDotIcon } from '@/icons';
import { PessoaService } from '@/service/pessoa.service';
import { Pessoa, PessoaResponse } from '@/types/pessoa.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export default function PessoaList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [pessoas, setPessoas] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await PessoaService.getPessoas();
        setPessoas(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
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
                Nome
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
                Acesso
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
              paginatedData.map((user: PessoaResponse) => (
                <>
                  <TableRow key={user.id}>
                    <TableCell className="w-8">
                      <button
                        onClick={() => handleToggleExpand(String(user.id))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                      >
                        {expandedRowId === String(user.id) ? (
                          <ChevronUpIcon size={18} />
                        ) : (
                          <ChevronDownIcon size={18} />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {user.nomeSocial || user.nome}
                    </TableCell>

                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {user.empresa?.nomeFantasia}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          user.tipo?.descricao === 'FUNCIONARIO'
                            ? 'success'
                            : user.tipo?.descricao === 'SUPERVISOR'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {user.tipo?.descricao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="relative inline-block">
                        <button
                          onClick={() => handleToggleDropdown(String(user.id))}
                          className="dropdown-toggle"
                        >
                          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown
                          isOpen={openDropdownId === String(user.id)}
                          onClose={() => setOpenDropdownId(null)}
                          className="w-40 p-2"
                        >
                          <DropdownItem
                            onClick={() =>
                              router.push(`/gerenciar-pessoa/${user.id}`)
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

                  {expandedRowId === String(user.id) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="bg-gray-50 dark:bg-gray-900/30"
                      >
                        <div className="space-y-2 p-4 text-sm text-gray-700 dark:text-gray-300">
                          <p>
                            <strong>Login:</strong>
                            {user.usuarios.map((usuarios) => usuarios.login)}
                          </p>
                          <p>
                            <strong>Perfil:</strong>{' '}
                            {user.usuarios?.map((u) => u.perfil?.descricao)}
                          </p>
                          <p>
                            <strong>Gênero:</strong> {user.genero}
                          </p>
                          <p>
                            <strong>Ativo:</strong> {user.ativo}
                          </p>
                          <p>
                            <strong>Criado em:</strong>{' '}
                            {new Date(user.createdAt || '').toLocaleString()}
                          </p>
                          {user.motivo && (
                            <p>
                              <strong>Motivo:</strong> {user.motivo}
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
  );
}
