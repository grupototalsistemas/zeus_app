import { BaseEntity } from './base.type';
import { ChamadoMovimento } from './chamadoMovimento.type';

export interface ChamadoMovimentoEtapa extends BaseEntity {
  id_empresa: number;
  descricao: string;
  movimentos?: ChamadoMovimento[];
}
