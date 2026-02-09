import { BaseEntity } from './base.type';

export interface Sistemas extends BaseEntity {
  id_pessoa_juridica_base: number;
  sistema: string;
  descricao: string;
  status_web: number;
}
