import { BaseEntity } from './base.type';

export interface Perfil extends BaseEntity {
  empresaId?: number;
  descricao: string;
}

export interface PerfilDTO extends BaseEntity {
  empresaId: number;
  email?: string;
  senha?: string;
  nome?: string;
  descricao: string;
}
