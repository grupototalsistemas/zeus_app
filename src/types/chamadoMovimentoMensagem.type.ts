import { BaseEntity } from './base.type';
export interface ChamadoMovimentoMensagem extends BaseEntity {
  movimentoId: number;
  usuarioEnvioId: number;
  usuarioLeituraId: number;
  ordem?: number;
  descricao: string;
  envio?: string;
  leitura?: string;
}
