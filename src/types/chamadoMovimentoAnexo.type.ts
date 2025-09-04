import { BaseEntity } from './base.type';
export interface ChamadoMovimentoAnexo extends BaseEntity {
  movimentoId: number;
  usuarioId: number;
  ordem?: number;
  url: string;
  mimeType?: string;
  nomeOriginal?: string;
  pathname?: string;
  tamanho?: number;
  descricao: string;
  dataHora?: string;
  caminho: string;
}
