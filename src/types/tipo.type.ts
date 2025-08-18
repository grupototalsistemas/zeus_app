import { BaseEntity } from './base.type';
import { StatusRegistro } from './enum';

export interface Tipo extends BaseEntity {
  id?: number;
  empresaId: number;

  descricao: string;
  ativo?: StatusRegistro;
}
