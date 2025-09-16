'use client';

import { MoreDotIcon } from '@/icons';

import { useEmpresaCategoria } from '@/hooks/useEmpresaCategoria';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import { StatusRegistro } from '@/types/enum';
import { selectEmpresasById } from '@/utils/empresa.utils';
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

export default function CategoriaEmpresaList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { empresaCategorias, getAll, remove } = useEmpresaCategoria();

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  useEffect(() => {
    empresaCategorias.length === 0 && getAll();
  }, []);

  const totalPages = Math.ceil(empresaCategorias.length / itemsPerPage);
  const paginatedData = empresaCategorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (empresaCategoria: EmpresaCategoria) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o/a "${empresaCategoria.descricao}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      remove(empresaCategoria.id!);

      setOpenDropdownId(null);

      const newTotalPages = Math.ceil(
        (empresaCategorias.length - 1) / itemsPerPage
      );
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
              {/* <TableCell className="w-8">{''}</TableCell> */}
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
                Ativo
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
              paginatedData.map((categoria) => (
                <>
                  <TableRow key={categoria.id || categoria.descricao}>
                    {/* <TableCell className="w-8">
                      <button
                        onClick={() => handleToggleExpand(String(categoria.id))}
                        className="p-1 text-gray-500 hover:text-gray-800"
                      >
                        {expandedRowId === String(categoria.id) ? (
                          <ChevronUpIcon size={18} />
                        ) : (
                          <ChevronDownIcon size={18} />
                        )}
                      </button>
                    </TableCell> */}

                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {categoria.descricao}
                    </TableCell>

                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {selectEmpresasById(categoria.empresaId)?.nomeFantasia}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          categoria.ativo === StatusRegistro.ATIVO
                            ? 'success'
                            : 'error'
                        }
                      >
                        {categoria.ativo === StatusRegistro.ATIVO
                          ? 'Ativo'
                          : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            handleToggleDropdown(String(categoria.id))
                          }
                          className="dropdown-toggle"
                        >
                          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                        </button>
                        <Dropdown
                          isOpen={openDropdownId === String(categoria.id)}
                          onClose={() => setOpenDropdownId(null)}
                          className="w-40 p-2"
                        >
                          <DropdownItem
                            onClick={() =>
                              router.push(`/editar-usuario/${categoria.id}`)
                            }
                          >
                            Editar
                          </DropdownItem>
                          <DropdownItem onClick={() => handleDelete(categoria)}>
                            Deletar
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-theme-sm flex items-center justify-center py-10 text-gray-500 dark:text-gray-400"
                >
                  Nenhum categoria encontrada
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
