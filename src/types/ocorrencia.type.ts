import { BaseEntity } from "./base.type";

export interface Ocorrencia extends BaseEntity{
  id_ocorrencia: number;
  id_ocorrencia_tipo: number;
  id_empresa: number;
  descricao: string;
  
}
