'use client';

import { useEffect, useRef, useState } from 'react';
import Badge from '../ui/badge/Badge';

import { useChamado } from '@/hooks/useChamado';
import { usePerfil } from '@/hooks/usePerfil';
import { usePrioridade } from '@/hooks/usePrioridade';
import { useSistema } from '@/hooks/useSistema';
import { MoreDotIcon } from '@/icons';
import { RootState } from '@/store/rootReducer';
import { Chamado } from '@/types/chamado.type';
import { StatusRegistro } from '@/types/enum';
import {
  diasAtras,
  formataDataParaExibir,
  formataHoraParaExibir,
} from '@/utils/fomata-data';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import ChamadoModal from '../modal/ChamadoModal';
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

export default function TicketList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const triggerRefs = useRef<{
    [key: string]: React.RefObject<HTMLButtonElement | null>;
  }>({});

  const { chamados, getAll, remove } = useChamado();
  const { selectPerfilById } = usePerfil();
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
    getAll();
  }, []);

  const handleDelete = async (chamado: Chamado) => {
    // Confirmação antes de excluir
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o chamado: "${chamado.titulo}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) {
      return; // Usuário cancelou a exclusão
    }

    try {
      // await ChamadoService.deleteChamado(chamado.id!);
      remove(chamado.id!);
      // Fecha o dropdown se estiver aberto
      setOpenDropdownId(null);
      // Recarrega a tabela
      getAll();

      // Ajusta a página atual se necessário
      const newTotalPages = Math.ceil((chamados.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      console.log('Chamado excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir chamado:', error);
      alert('Erro ao excluir o chamado. Tente novamente.');
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
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 py-3 text-start font-medium text-gray-500 md:border-none dark:border-gray-800 dark:text-gray-400"
              >
                Protocolo
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Entrada
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Hora
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs dark:text-gray-40 border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800"
              >
                Sistema
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Empresa
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Codigo
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Prazo
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Ultima Atualização
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Dias
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs border-r border-gray-100 px-3 py-3 text-start font-medium text-gray-500 md:border-none md:px-0 dark:border-gray-800 dark:text-gray-400"
              >
                Responsavel
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs px-3 py-3 text-start font-medium text-gray-500 md:px-0 dark:text-gray-400"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {chamados.length > 0 &&
              chamados.map((chamado) => (
                <TableRow
                  key={chamado.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => handleRowClick(chamado)}
                >
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {chamado.protocolo || 'N/A'}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {formataDataParaExibir(chamado.createdAt || '')}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {formataHoraParaExibir(chamado.createdAt || '')}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {findById(chamado.sistemaId)?.nome}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {selectEmpresasById(chamado.empresaId)?.nomeFantasia}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {chamado.id}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        chamado.ativo === StatusRegistro.ATIVO
                          ? 'success'
                          : chamado.ativo === StatusRegistro.INATIVO
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {ultimoMovimento(chamado)?.etapa?.descricao ||
                        chamado.ativo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {selectPrioridadeById(chamado.prioridadeId)?.descricao}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {formataDataParaExibir(
                      ultimoMovimento(chamado)?.createdAt || ''
                    )}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {diasAtras(formataDataParaExibir(chamado.createdAt || ''))}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {
                      selectPerfilById(
                        ultimoMovimento(chamado)?.usuarioId || chamado.usuarioId
                      )?.descricao
                    }
                  </TableCell>
                  <TableCell
                    className="text-theme-sm py-3 text-gray-500 dark:text-gray-400"
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
                            router.push(`/editar-chamado/${chamado.id}`)
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
    </div>
  );
}
