import { BaseEntity } from './base.type';

export interface Ocorrencia extends BaseEntity {
  tipoId: number;
  empresaId: number;
  descricao: string;
}
