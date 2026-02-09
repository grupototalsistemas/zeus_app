import { BaseEntity } from './base.type';

export interface OcorrenciaTipo extends BaseEntity {
  id_empresa: number;
  descricao: string;
}
