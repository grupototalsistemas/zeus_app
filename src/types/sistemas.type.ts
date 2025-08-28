
import { BaseEntity } from "./base.type";
export interface Sistema extends BaseEntity{
  id?: number;
  empresaId: number;
  nome: string;
  descricao: string;
  
}
