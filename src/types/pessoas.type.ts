import { BaseEntity } from './base.type';
import { StatusGenero } from './enum';

export interface Pessoa extends BaseEntity {
  id?: number;
  empresaId?: number;
  tipoId?: number;
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}
