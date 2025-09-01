import { BaseEntity } from './base.type';

export interface EmpresaTipo extends BaseEntity {
  empresaId: number;
  descricao: string;
}
