'use client';

import { useEffect, useState } from 'react';
import Badge from '../ui/badge/Badge';

import { MoreDotIcon } from '@/icons';
import { ChamadoService } from '@/service/chamado.service';
import { useRouter } from 'next/navigation';
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
import { tickets } from './ticket.example';

export default function TicketList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const [open, setOpen] = useState(false);
  const [chamados, setChamados] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Dados da página atual
  const paginatedData = tickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await ChamadoService.getChamados();

        console.log('Chamadinho: ', response);
      } catch (error) {
        console.error('Error fetching chamados:', error);
      }
    };
    fetchChamados();
  });
  const handleToggle = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Protocolo
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Entrada
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Hora
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Sistema
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Serventia
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Codigo
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
                Prazo
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Ultima Atualização
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Dias
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Responsavel
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {chamados.length > 0 &&
              chamados.map((product) => (
                <TableRow key={product.id} className="">
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.protocolo}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.entrada.getTime()}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.hora}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.sistema}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.serventia}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.codigo}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        product.status === 'open'
                          ? 'success'
                          : product.status === 'in-progress'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.prazo}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.ultimaAtualizacao.getTime()}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.diasAtras}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.responsavel}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <div className="relative inline-block">
                      <button
                        onClick={() => handleToggle(product.id)}
                        className="dropdown-toggle"
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown
                        isOpen={openDropdownId === product.id}
                        onClose={() => setOpenDropdownId(null)}
                        className="w-40 p-2"
                      >
                        <DropdownItem
                          tag="a"
                          onClick={() =>
                            router.push(`/editar-chamado/${product.id}`)
                          }
                          className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem
                          tag="a"
                          className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Deletar
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {chamados.length === 0 && (
              <TableRow>
                <TableCell
                  {...{ colSpan: 12 }}
                  className="text-theme-sm h-24 py-3 text-center text-gray-500 dark:text-gray-400"
                >
                  Nenhum chamado encontrado.
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
