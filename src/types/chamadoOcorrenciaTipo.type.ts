import { BaseEntity } from './base.type';

export interface OcorrenciaTipo extends BaseEntity {
  empresaId: number;
  descricao: string;
}
