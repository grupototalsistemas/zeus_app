import { BaseEntity } from './base.type';

export interface OcorrenciaTipo extends BaseEntity {
  id?: number;
  idEmpresa: number;
  descricao: string;
}

export interface Ocorrencia extends BaseEntity {
  id?: number;
  idOcorrenciaTipo: number;
  idEmpresa: number;
  descricao: string;

  // Para joins
  ocorrenciaTipo?: OcorrenciaTipo;
}
