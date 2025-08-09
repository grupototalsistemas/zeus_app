import { BaseEntity } from "./base.type";
import { StatusSiglaEstado } from "./enum";

export interface Empresa extends BaseEntity {
  id_empresa: number;
  id_parent_empresa: number;
  id_empresa_tipo: number;
  id_empresa_categoria: number;
  cnpj: string;
  codigo?: string;
  razao_social: string;
  nome_fantasia: string;
  logradouro?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: StatusSiglaEstado;
  cep?: string;
  contato?: string;
  email?: string;
  observacao?: string;
  
}
