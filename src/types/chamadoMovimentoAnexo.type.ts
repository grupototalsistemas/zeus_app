import { BaseEntity } from './base.type';
export interface ChamadoMovimentoAnexo extends BaseEntity {
  movimentoId: number;
  usuarioId: number;
  ordem?: number;
  descricao: string;
  dataHora?: string;
  caminho: string;
}
