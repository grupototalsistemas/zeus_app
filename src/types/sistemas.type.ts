
import { BaseEntity } from "./base.type";
export interface Sistema extends BaseEntity{
  id_sistema: number;
  id_empresa: number;
  nome: string;
  descricao: string;
  
}
