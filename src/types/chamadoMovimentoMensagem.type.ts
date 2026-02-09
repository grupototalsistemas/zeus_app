import { BaseEntity } from './base.type';

export interface ChamadoMovimentoMensagem extends BaseEntity {
  id_chamado_movimento: number;
  id_pessoa_usuario_envio: number;
  id_pessoa_usuario_leitura: number;
  ordem?: number;
  descricao: string;
  dataHoraEnvio?: string;
  dataHoraLeitura?: string;
}
