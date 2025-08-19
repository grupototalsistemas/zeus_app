import { BaseEntity } from './base.type';
import { StatusGenero } from './enum';

export interface Pessoa extends BaseEntity {
  id?: number;
  empresaId?: number;
  tipoId?: number;
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}

export interface PessoaDTO extends BaseEntity {
  
  id_empresa?: number;
  id_pessoa_tipo?: number;
  genero: StatusGenero;
  nome: string;
  nome_social?: string;
}
