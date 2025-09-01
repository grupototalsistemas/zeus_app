import { BaseEntity } from './base.type';
import { StatusGenero } from './enum';

export interface Pessoa extends BaseEntity {
  empresaId?: number;
  tipoId?: number;
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}
