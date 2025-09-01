import { BaseEntity } from './base.type';
export interface Sistema extends BaseEntity {
  empresaId: number;
  nome: string;
  descricao: string;
}
