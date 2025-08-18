'use client';

import { MoreDotIcon } from '@/icons';
import { PessoaService } from '@/service/pessoa.service';
import { Pessoa } from '@/types/pessoas.type';
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
import { users } from './user.example';

export default function UserList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const paginatedData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await PessoaService.getPessoas();
        setPessoas(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (pessoa: Pessoa) => {
    // Confirmação antes de excluir
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o/a "${pessoa.nome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }

    try {
      // await deletePessoa(pessoa.id!);
      const response = await PessoaService.deletePessoa(pessoa.id!);
      console.log(response);
      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((pessoas.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      console.log('Tipo excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir tipo:', error);
      alert('Erro ao excluir o tipo. Tente novamente.');
    }
  };

  const handleToggle = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
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
                Nome
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
            {pessoas.length > 0 &&
              pessoas.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {user.nomeSocial || user.nome}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {user.usuarios[0].email}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {user.empresa.nomeFantasia}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        user.tipo.descricao === 'FUNCIONARIO'
                          ? 'success'
                          : user.acesso === 'suporte'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {user.tipo.descricao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="relative inline-block">
                      <button
                        onClick={() => handleToggle(user.id)}
                        className="dropdown-toggle"
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown
                        isOpen={openDropdownId === user.id}
                        onClose={() => setOpenDropdownId(null)}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          onClick={() =>
                            router.push(`/editar-usuario/${user.id}`)
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
              ))}
            {pessoas.length === 0 && (
              <TableRow>
                <TableCell
                  {...{ colSpan: 5 }}
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
