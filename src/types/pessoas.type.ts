import { BaseEntity } from "./base.type";
import { StatusGenero } from "./enum";

export interface Pessoa extends BaseEntity{
  id_pessoa?: number;
  id_empresa?: number;
  id_pessoa_tipo?: number;
  genero: StatusGenero;
  nome: string;
  nome_social?: string;
  
}
