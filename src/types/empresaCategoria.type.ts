import { BaseEntity } from "./base.type";
import { StatusRegistro } from "./enum";

export interface EmpresaCategoria extends BaseEntity{
  id_empresa_categoria: number;
  id_empresa: number;
  descricao: string;
  ativo: StatusRegistro;
  created_at: string;
  updated_at?: string;
}
