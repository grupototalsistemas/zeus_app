import { BaseEntity } from './base.type';
import { StatusRegistro } from './enum';

export interface Perfil extends BaseEntity {
  id?: number;
  empresaId: number;

  descricao: string;
  ativo?: StatusRegistro;
  motivo?: string;
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
