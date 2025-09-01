import { BaseEntity } from './base.type';
import { ChamadoMovimento } from './chamadoMovimento.type';
export interface ChamadoMovimentoEtapa extends BaseEntity {
  empresaId: number;
  descricao: string;
  movimentos?: ChamadoMovimento[];
}
