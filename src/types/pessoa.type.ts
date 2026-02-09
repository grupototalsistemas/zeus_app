import { BaseEntity } from './base.type';

export interface Pessoas extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  chave?: string;
  senha?: string;
  codigo?: string;
}

export interface PessoaResponse extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  codigo?: string;
  chave?: string;
  senha?: string;
}
