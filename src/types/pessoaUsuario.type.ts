import { BaseEntity } from "./base.type";
import { Perfil } from "./perfis.type";
import { Pessoa } from "./pessoas.type";

export interface PessoaUsuario extends BaseEntity{
  id_pessoa_usuario?: number;
  id_pessoa: number;
  id_pessoa_perfil: number;
  email: string;
  login: string;
  senha?: string;
  
}


export interface PessoaUsuarioDTO extends BaseEntity{

  pessoa: Pessoa;
  perfil: Perfil;
  email: string;
  login: string;
  senha: string;
  
}