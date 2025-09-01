import { BaseEntity } from './base.type';

export interface PessoaTipo extends BaseEntity {
  empresaId: number;
  descricao: string;
}
