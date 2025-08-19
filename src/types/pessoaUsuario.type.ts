import { BaseEntity } from './base.type';
import { Perfil, PerfilDTO } from './perfil.type';
import { Pessoa, PessoaDTO } from './pessoas.type';

export interface PessoaUsuario extends BaseEntity {
  id_pessoa_usuario?: number;
  id_pessoa: number;
  id_pessoa_perfil: number;
  email: string;
  login: string;
  senha?: string;
}

export interface PessoaUsuarioDTO extends BaseEntity {
  pessoa: Pessoa;
  perfilId: number;
  email: string;
  login: string;
  senha: string;
}

export interface PessoaUsuarioRegisterDTO extends BaseEntity {
  pessoa: PessoaDTO;
  perfil: PerfilDTO;
  email: string;
  login: string;
  senha: string;
}

export interface loginResponse {
  id: string;
  email: string;
  login: string;
  pessoaId: string;
  nome: string;
  nomeSocial: string;
  perfilId: string;
  genero: string;
  perfil: string;
}
