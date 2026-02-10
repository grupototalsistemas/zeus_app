import { BaseEntity } from './base.type';

export interface PessoasContatos extends BaseEntity {
  id_pessoa_contato_tipo: string;
  id_pessoa: string;
  descricao: string;
}
