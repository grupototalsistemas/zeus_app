import { BaseEntity } from './base.type';
import { ChamadoMovimentoAnexo } from './chamadoMovimentoAnexo.type';
import { ChamadoMovimentoEtapa } from './chamadoMovimentoEtapa.type';
import { ChamadoMovimentoMensagem } from './chamadoMovimentoMensagem.type';
export interface ChamadoMovimento extends BaseEntity {
  chamadoId: number;
  etapaId: number;
  usuarioId: number;
  ordem?: number;
  inicio?: string;
  fim?: string;
  descricaoAcao: string;
  observacaoTec?: string;
  etapa?: ChamadoMovimentoEtapa;
  anexos?: ChamadoMovimentoAnexo[];
  mensagens?: ChamadoMovimentoMensagem[];
}
