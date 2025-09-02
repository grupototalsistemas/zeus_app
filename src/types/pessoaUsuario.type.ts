import { BaseEntity } from './base.type';
import { StatusGenero } from './enum';
import { Pessoa } from './pessoa.type';
import { PerfilDTO } from './pessoaPerfil.type';

export interface PessoaUsuario extends BaseEntity {
  pessoaId: number;
  perfilId: number;
  email: string;
  login: string;
  senha?: string;
}

export interface PessoaUsuarioRegisterDTO extends BaseEntity {
  pessoa: Pessoa;
  perfil: PerfilDTO;
  email: string;
  login: string;
  senha: string;
}

export interface PessoaUsuarioDTO {
  pessoa: Pessoa;
  perfilId: number;
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
