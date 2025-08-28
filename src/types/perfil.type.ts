import { BaseEntity } from './base.type';
import { StatusRegistro } from './enum';

export interface Perfil extends BaseEntity {
  id?: number;
  empresaId: number;
  email?: string;
  senha?: string;
  nome: string;
  descricao: string;
  ativo?: StatusRegistro;
  motivo?: string;
}

export interface PerfilDTO extends BaseEntity {
  id_empresa?: number;
  descricao: string;
}

export interface PerfilPermissao extends BaseEntity {
  id_perfil_permissao?: number;
  id_perfil: number;
  id_permissao: number;
  ler: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}

export interface Permissao extends BaseEntity {
  id_permissao?: number;
  nome: string;
  descricao: string;
  chave: string;
  grupo: string;
  ativo?: StatusRegistro;
}
