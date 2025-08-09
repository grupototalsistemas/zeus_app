import { BaseEntity } from "./base.type";

export interface PessoaTipo extends BaseEntity{
  id_pessoa_tipo: number;
  id_empresa: number;
  descricao: string;

}
