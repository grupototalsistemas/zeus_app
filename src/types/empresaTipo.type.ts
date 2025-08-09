import { BaseEntity } from "./base.type";
import { StatusRegistro } from "./enum";

export interface EmpresaTipo extends BaseEntity{
  id_empresa_tipo: number;
  id_empresa: number;
  descricao: string;
  ativo: StatusRegistro;
  created_at: string;
  updated_at?: string;
}
