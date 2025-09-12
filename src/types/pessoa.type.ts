import { BaseEntity } from './base.type';
import { Empresa } from './empresa.type';
import { StatusGenero } from './enum';
import { PessoaTipo } from './pessoaTipo.type';
import { PessoaUsuarioResponse } from './pessoaUsuario.type';

export interface Pessoa extends BaseEntity {
  empresaId?: number;
  tipoId?: number;
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}

export interface PessoaResponse extends BaseEntity {
  empresa: Empresa;
  tipo: PessoaTipo;
  usuarios: PessoaUsuarioResponse[];
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}
