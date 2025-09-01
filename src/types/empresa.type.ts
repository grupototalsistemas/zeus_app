import { BaseEntity } from './base.type';
import { StatusSiglaEstado } from './enum';

export interface Empresa extends BaseEntity {
  parentId: number;
  tipoId: number;
  categoriaId: number;
  cnpj: string;
  codigo?: string;
  razaoSocial: string;
  nomeFantasia: string;
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
