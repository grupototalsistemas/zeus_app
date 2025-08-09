
import { BaseEntity } from "./base.type";
export interface ChamadoMovimento extends BaseEntity {
  id_chamado_movimento: number;
  id_chamado: number;
  id_chamado_movimento_etapa: number;
  id_pessoa_usuario: number;
  ordem?: number;
  data_hora_inicio?: string;
  data_hora_fim?: string;
  descricao_acao: string;
  observacao_tecnica: string;
  
}
