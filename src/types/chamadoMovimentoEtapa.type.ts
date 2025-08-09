import { BaseEntity } from "./base.type";
export interface ChamadoMovimentoEtapa extends BaseEntity {
  id_chamado_movimento_etapa: number;
  id_empresa: number;
  descricao: string;
  
}
