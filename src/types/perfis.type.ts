
import { BaseEntity } from "./base.type";
export interface Perfil extends BaseEntity{
  id_perfil?: number;
  id_empresa?: number;
  descricao: string;
  
}
