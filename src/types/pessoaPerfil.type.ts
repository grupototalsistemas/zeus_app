import { BaseEntity } from './base.type';

export interface PessoasJuridicasPerfis extends BaseEntity {
  id_pessoa_juridica: number;
  descricao: string;
  status_view?: number;
}

// Manter DTOs legados para compatibilidade
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
