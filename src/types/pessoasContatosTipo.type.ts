import { BaseEntity } from './base.type';

export interface PessoasContatosTipo extends BaseEntity {
  id_pessoa: number;
  descricao: string;
}
