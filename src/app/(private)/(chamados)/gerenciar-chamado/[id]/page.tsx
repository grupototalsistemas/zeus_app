'use client';

import { TicketFormBase } from '@/components/form/ticket/TicketForm';
import { ChamadoService } from '@/service/chamado.service';
import { MovimentoAnexoService } from '@/service/movimentoAnexo.service';
import { Chamado } from '@/types/chamado.type';
import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';
import { StatusRegistro } from '@/types/enum';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anexos, setAnexos] = useState<ChamadoMovimentoAnexo[]>([]);

  useEffect(() => {
    const fetchTicketFromAPI = async (id: string) => {
      try {
        setLoading(true);
        const response: Chamado = await ChamadoService.getChamado(Number(id));
        console.log('Chamado da API:', response);

        // Buscar anexos do primeiro movimento, se existir
        if (response.movimentos && response.movimentos.length > 0) {
          const primeiroMovimento = response.movimentos[0];
          try {
            const anexosData =
              await MovimentoAnexoService.getMovimentoAnexosByMovimento(
                primeiroMovimento.id!
              );
            console.log('Anexos do movimento:', anexosData);
            setAnexos(anexosData);
          } catch (error) {
            console.error('Erro ao buscar anexos:', error);
          }
        }

        // Mapear dados da API para o formato do formulário
        const mappedData = {
          empresaId: response.id_empresa?.toString() || '',
          sistemaId: response.id_sistema?.toString() || '',
          pessoaId: response.id_pessoa_empresa?.toString() || '',
          usuarioId: response.id_pessoa_usuario?.toString() || '',
          titulo: response.titulo || '',
          descricao: response.descricao || '',
          prioridadeId: response.id_prioridade?.toString() || '',
          ocorrenciaId: response.id_ocorrencia?.toString() || '',
          observacao: response.observacao || '',
          protocolo: response.protocolo?.toString() || '',
          ativo: response.situacao || StatusRegistro.ATIVO,
          empresaNome:
            response.empresa?.nome_fantasia ||
            response.empresa?.razao_social ||
            '',
          pessoaNome:
            response.pessoaFisica?.nome_social ||
            response.pessoaFisica?.nome_registro ||
            '',
        };

        console.log('Dados mapeados para o formulário:', mappedData);
        setTicket(mappedData);
      } catch (error) {
        console.error('Erro ao buscar chamado:', error);
        alert('Erro ao carregar chamado');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketFromAPI(id?.toString() || '0');
  }, [id]);

  const handleEdit = async (data: any) => {
    try {
      console.log('Dados do formulário para atualização:', data);

      // Mapear dados do formulário para o formato da API
      const apiData = {
        id_empresa: Number(data.empresaId),
        id_sistema: Number(data.sistemaId),
        id_pessoa_empresa: Number(data.pessoaId),
        id_pessoa_usuario: Number(data.usuarioId),
        id_ocorrencia: Number(data.ocorrenciaId),
        id_prioridade: Number(data.prioridadeId),
        titulo: data.titulo,
        descricao: data.descricao,
        observacao: data.observacao || '',
        situacao: data.ativo,
      };

      console.log('Dados mapeados para a API:', apiData);

      const response = await ChamadoService.updateChamado(Number(id), apiData);
      console.log('Resposta da API:', response);

      alert('Chamado atualizado com sucesso!');
      router.push('/chamados');
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      alert('Erro ao atualizar chamado');
      throw error;
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!ticket) return <div>Chamado não encontrado</div>;

  return (
    <TicketFormBase
      mode="edit"
      initialData={ticket}
      initialEmpresaNome={ticket?.empresaNome}
      initialPessoaNome={ticket?.pessoaNome}
      onSubmit={handleEdit}
      existingAttachments={anexos}
    />
  );
}
