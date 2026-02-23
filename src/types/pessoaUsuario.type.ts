import { BaseEntity } from './base.type';
import { Pessoas } from './pessoa.type';
import { PerfilDTO } from './pessoaPerfil.type';

export interface PessoasUsuarios extends BaseEntity {
  id_pessoa_fisica: number;
  nome_login: string;
  login: string;
  senha?: string;
  senha_master?: string;
  first_access: number;
}

// Manter interface legada para compatibilidade
export interface PessoaUsuario extends BaseEntity {
  pessoaId: number;
  perfilId: number;
  email: string;
  login: string;
  senha?: string;
}

export interface PessoaUsuarioResponse extends BaseEntity {
  perfil: PerfilDTO;
  perfilId?: number;
  email: string;
  login: string;
  senha?: string;
}

export interface PessoaUsuarioRegisterDTO extends BaseEntity {
  pessoa: Pessoas;
  perfil: PerfilDTO;
  email: string;
  login: string;
  senha: string;
}

export interface PessoaUsuarioDTO {
  pessoa: Pessoas;
  perfilId: number;
  email: string;
  login: string;
  senha: string;
}

export interface loginResponse {
  id_pessoa_usuario: string;
  id_pessoa: string;
  id_pessoa_juridica: string;
  id_pessoa_juridica_fisica: string;
  id_pessoa_fisica: string;
  id_pessoa_juridica_perfil: string;
  id_sistema: string;
  juridica_principal: number;
  nome_login: string;
  login: string;
  empresa: string;
  funcionario: string;
  first_access: number;
  chave: string | null;
}
