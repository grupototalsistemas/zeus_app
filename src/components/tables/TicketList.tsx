'use client';

import { useEffect, useRef, useState } from 'react';

import { useChamado } from '@/hooks/useChamado';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useSistema } from '@/hooks/useSistema';
import { MoreDotIcon } from '@/icons';
import { RootState } from '@/store/rootReducer';
import { Chamado } from '@/types/chamado.type';

import { usePessoa } from '@/hooks/usePessoa';
import { diasAtras, formatarData } from '@/utils/fomata-data';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import ChamadoModal from '../modal/ChamadoModal';
import DeleteChamadoModal from '../modal/DeleteChamadoModal';
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

// Definição dos headers da tabela
const TABLE_HEADERS = [
  { label: 'Protocolo', width: 'w-24' },
  { label: 'Titulo', width: 'w-20' },
  { label: 'Sistema', width: 'w-32' },
  { label: 'Empresa', width: 'w-40' },
  { label: 'Etapa', width: 'w-32' },
  { label: 'Prazo', width: 'w-28' },
  { label: 'Entrada', width: 'w-28' },
  { label: 'Hora', width: 'w-20' },
  { label: 'Ultima Atualização', width: 'w-36' },
  { label: 'Dias', width: 'w-16' },
  { label: 'Reclamante', width: 'w-40' },
  { label: 'Ações', width: 'w-20' },
];

export default function TicketList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chamadoToDelete, setChamadoToDelete] = useState<Chamado | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const triggerRefs = useRef<{
    [key: string]: React.RefObject<HTMLButtonElement | null>;
  }>({});

  const { chamados, getAll, getAllByUsuarioLogado, remove } = useChamado();
  // console.log('Chamados carregados:', chamados);
  const { selectPessoaById } = usePessoa();
  const { selectPrioridadeById } = usePrioridade();
  const { findById } = useSistema();
  const empresas = useSelector((state: RootState) => state.empresa.empresas);
  const totalPages = Math.ceil(chamados.length / itemsPerPage);

  // Dados da página atual
  const paginatedData = chamados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //função para pegar o ultimo movimento do chamado
  const ultimoMovimento = (chamado: Chamado) => {
    if (chamado.movimentos && chamado.movimentos.length > 0) {
      return chamado.movimentos[chamado.movimentos.length - 1];
    } else {
      return null;
    }
  };

  // Criar refs para cada botão de dropdown
  const getTriggerRef = (id: string) => {
    if (!triggerRefs.current[id]) {
      triggerRefs.current[id] = React.createRef<HTMLButtonElement>();
    }
    return triggerRefs.current[id];
  };

  useEffect(() => {
    getAllByUsuarioLogado();
  }, [getAllByUsuarioLogado]);

  const handleDelete = (chamado: Chamado) => {
    setChamadoToDelete(chamado);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (motivo: string) => {
    if (!chamadoToDelete?.id) return;

    try {
      await remove(chamadoToDelete.id, motivo);
      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);
      // Recarrega a tabela
      getAllByUsuarioLogado();

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((chamados.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      console.log('Chamado excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir chamado:', error);
      throw new Error('Erro ao excluir o chamado. Tente novamente.');
    }
  };

  const handleToggle = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = (chamado: Chamado) => {
    setSelectedChamado(chamado);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedChamado(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (chamado: Chamado) => {
    handleOpenModal(chamado);
  };

  function selectEmpresasById(empresaId: number) {
    return empresas.find((empresa) => empresa.id === Number(empresaId));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              {TABLE_HEADERS.map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className={`text-theme-xs ${header.width} ${index < TABLE_HEADERS.length - 1 ? 'border-r border-gray-100 dark:border-gray-800' : ''} px-3 py-3 text-center font-medium text-gray-500 md:border-none md:px-0 dark:text-gray-400`}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {chamados.length > 0 &&
              chamados.map((chamado: Chamado) => (
                <TableRow
                  key={chamado.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => handleRowClick(chamado)}
                >
                  {/* Protocolo */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {chamado.protocolo || 'N/A'}
                  </TableCell>
                  {/* Titulo */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {chamado.titulo || 'N/A'}
                  </TableCell>
                  {/* Sistema */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {chamado.sistema?.sistema || 'N/A'}
                  </TableCell>
                  {/* Empresa */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {chamado.empresa?.nome_fantasia ||
                      selectEmpresasById(chamado.id_empresa)?.nome_fantasia ||
                      'N/A'}
                  </TableCell>
                  {/* Etapa */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {ultimoMovimento(chamado)?.etapa?.descricao || 'N/A'}
                  </TableCell>
                  {/* Prazo */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        selectPrioridadeById(String(chamado.id_prioridade))
                          ?.cor || 'primary'
                      }
                    >
                      {selectPrioridadeById(String(chamado.id_prioridade))
                        ?.descricao || 'N/A'}
                    </Badge>
                  </TableCell>
                  {/* Entrada */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {formatarData(chamado.createdAt || '', 'data') || 'N/A'}
                  </TableCell>
                  {/* Hora */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {formatarData(chamado.createdAt || '', 'hora')}
                  </TableCell>
                  {/* Ultima Atualização */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {formatarData(
                      ultimoMovimento(chamado)?.createdAt ||
                        chamado.createdAt ||
                        '',
                      'data'
                    )}
                  </TableCell>
                  {/* Dias */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {diasAtras(formatarData(chamado.createdAt || '', 'data'))}
                  </TableCell>
                  {/* Responsavel */}
                  <TableCell className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400">
                    {chamado.pessoaFisica?.nome_social ||
                      chamado.pessoaFisica?.nome_registro ||
                      'N/A'}
                  </TableCell>
                  {/* Ações */}
                  <TableCell
                    className="text-theme-sm px-2 py-3 text-gray-500 dark:text-gray-400"
                    onClick={(e) => e.stopPropagation()} // Previne o clique da linha no dropdown
                  >
                    <div className="relative inline-block">
                      <button
                        ref={getTriggerRef(String(chamado.id))}
                        onClick={() => handleToggle(String(chamado.id))}
                        className="dropdown-toggle"
                      >
                        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                      <Dropdown
                        isOpen={openDropdownId === String(chamado.id)}
                        onClose={() => setOpenDropdownId(null)}
                        className="p-2"
                      >
                        <DropdownItem
                          tag="a"
                          onClick={() =>
                            router.push(`/gerenciar-chamado/${chamado.id}`)
                          }
                          className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem
                          tag="a"
                          onClick={() => handleDelete(chamado)}
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
      {selectedChamado && selectedChamado.id && (
        <>
          <ChamadoModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            chamadoId={selectedChamado.id}
          />
        </>
      )}
      <DeleteChamadoModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setChamadoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        chamado={chamadoToDelete}
      />
    </div>
  );
}
