import { BaseEntity } from './base.type';

export interface PessoasEnderecosTipo extends BaseEntity {
  id_pessoa: number;
  descricao: string;
}
