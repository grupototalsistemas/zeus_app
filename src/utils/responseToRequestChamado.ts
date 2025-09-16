import { CreateChamadoDto } from '@/types/chamado.type';

export const responseToRequestChamado = (response: any): CreateChamadoDto => {
  return {
    id: response.id,
    empresaId: response.empresaId,
    sistemaId: response.sistemaId,
    pessoaId: response.pessoaId,
    usuarioId: response.usuarioId,
    ocorrenciaId: response.ocorrenciaId,
    prioridadeId: response.prioridadeId,
    protocolo: response.protocolo,
    titulo: response.titulo,
    descricao: response.descricao,
    observacao: response.observacao,
    movimento: response.movimento,
    ativo: response.ativo,
    anexos: response.anexos,
  };
};
