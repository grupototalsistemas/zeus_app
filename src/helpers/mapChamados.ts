import { TicketFormData } from '@/components/form/ticket/TicketForm';
import { CreateChamadoDto } from '@/types/chamado.type';

export const mapChamados = (data: TicketFormData): CreateChamadoDto => {
  return {
    id_pessoa_juridica: Number(data.empresaId),
    id_sistema: Number(data.sistemaId), // Assumindo que o ID do sistema é o próprio valor
    id_pessoa_empresa: Number(data.pessoaId),
    id_pessoa_usuario: Number(data.usuarioId),
    id_ocorrencia: data.ocorrenciaId ? Number(data.ocorrenciaId) : 0,
    id_prioridade: Number(data.prioridadeId),
    protocolo: data.protocolo ? data.protocolo : undefined,
    titulo: data.titulo,
    descricao: data.descricao,
    observacao: data.observacao || '',
    situacao: data.ativo,
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
