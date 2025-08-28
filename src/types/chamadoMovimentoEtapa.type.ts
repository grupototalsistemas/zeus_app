import { BaseEntity } from "./base.type";
export interface ChamadoMovimentoEtapa extends BaseEntity {
  id?: number;
  empresaId: number;
  descricao: string;
  
}
