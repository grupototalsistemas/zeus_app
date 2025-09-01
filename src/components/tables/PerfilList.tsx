'use client';

import { usePerfil } from '@/hooks/usePerfil';
import { MoreDotIcon } from '@/icons';
import { StatusRegistro } from '@/types/enum';
import { Perfil } from '@/types/pessoaPerfil.type';
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

export default function PerfilList() {
  const router = useRouter();

  // Hook customizado com todas as operações de perfil
  const { perfis, loading, error, fetchPerfis, deletePerfil, clearError } =
    usePerfil();

  // Estados locais (apenas para UI)
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(perfis.length / itemsPerPage);

  const paginatedData = perfis.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (perfil: Perfil) => {
    // Confirmação antes de excluir
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o perfil "${perfil.descricao}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }

    try {
      await deletePerfil(perfil.id!);

      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((perfis.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      console.log('Perfil excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      alert('Erro ao excluir o perfil. Tente novamente.');
    }
  };

  useEffect(() => {
    // Só carrega se não há perfis no store ou se houver erro
    if (perfis.length === 0 && !loading) {
      fetchPerfis();
    }
  }, [fetchPerfis, perfis.length, loading]);

  const handleToggle = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  if (loading && perfis.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-500 dark:text-gray-400">
            Carregando perfis...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <div className="space-x-2">
              <button
                onClick={fetchPerfis}
                className="underline hover:no-underline"
              >
                Tentar novamente
              </button>
              <button
                onClick={clearError}
                className="underline hover:no-underline"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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
            {paginatedData.map((perfil) => (
              <TableRow key={perfil.id}>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {perfil.descricao}
                </TableCell>
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      perfil.ativo === StatusRegistro.ATIVO
                        ? 'success'
                        : 'error'
                    }
                  >
                    {perfil.ativo === StatusRegistro.ATIVO
                      ? 'Ativo'
                      : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative inline-block">
                    <button
                      onClick={() => handleToggle(perfil.id!)}
                      className="dropdown-toggle"
                      disabled={loading}
                    >
                      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>
                    <Dropdown
                      isOpen={openDropdownId === perfil.id}
                      onClose={() => setOpenDropdownId(null)}
                      className="w-40 p-2"
                    >
                      <DropdownItem
                        onClick={() =>
                          router.push(`/editar-perfil/${perfil.id}`)
                        }
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Editar
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleDelete(perfil)}
                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                      >
                        Deletar
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {perfis.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  {...{ colSpan: 3 }}
                  className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                >
                  Nenhum perfil encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {perfis.length > 0 && (
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
