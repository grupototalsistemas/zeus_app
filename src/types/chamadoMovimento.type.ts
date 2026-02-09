import { BaseEntity } from './base.type';
import { ChamadoMovimentoAnexo } from './chamadoMovimentoAnexo.type';
import { ChamadoMovimentoEtapa } from './chamadoMovimentoEtapa.type';
import { ChamadoMovimentoMensagem } from './chamadoMovimentoMensagem.type';

export interface ChamadoMovimento extends BaseEntity {
  id_chamado: number;
  id_chamado_movimento_etapa: number;
  id_pessoa_usuario: number;
  ordem?: number;
  dataHoraInicio?: string;
  dataHoraFim?: string;
  descricaoAcao: string;
  observacaoTecnica: string;
  etapa?: ChamadoMovimentoEtapa;
  anexos?: ChamadoMovimentoAnexo[];
  mensagens?: ChamadoMovimentoMensagem[];
}
