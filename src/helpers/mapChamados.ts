import { TicketFormData } from '@/components/form/ticket/TicketForm';
import { CreateChamadoDto } from '@/types/chamado.type';

export const mapChamados = (data: TicketFormData): CreateChamadoDto => {
  return {
    empresaId: Number(data.empresaId),
    sistemaId: Number(data.sistemaId), // Assumindo que o ID do sistema é o próprio valor
    pessoaId: Number(data.pessoaId),
    usuarioId: Number(data.usuarioId),
    ocorrenciaId: data.ocorrenciaId ? Number(data.ocorrenciaId) : 0,
    prioridadeId: Number(data.prioridadeId),
    protocolo: data.protocolo ? (data.protocolo) : undefined,
    titulo: data.titulo,
    descricao: data.descricao,
    observacao: data.observacao || '',
    ativo: data.ativo,
    anexos: data.anexos, // Adiciona os anexos ao chamado
    movimento: {
      etapaId: 1, // Assumindo que é a primeira etapa
      ordem: 1,
      descricaoAcao: 'Chamado criado',
      observacaoTec: data.observacao,
      usuarioId: Number(data.usuarioId),
    },
  };
};
