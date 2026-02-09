import { BaseEntity } from './base.type';

export interface PessoasContatos extends BaseEntity {
  id_pessoa_contato_tipo: number;
  id_pessoa: number;
  descricao: string;
}
