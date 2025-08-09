import { BaseEntity } from "./base.type";
export interface ChamadoMovimentoMensagem extends BaseEntity {
  id_chamado_movimento_mensagem: number;
  id_chamado_movimento: number;
  id_pessoa_usuario_envio: number;
  id_pessoa_usuario_leitura: number;
  ordem?: number;
  descricao: string;
  data_hora_envio?: string;
  data_hora_leitura?: string;
  
}
