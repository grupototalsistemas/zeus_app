import { BaseEntity } from './base.type';

export interface PessoasDadosAdicionais extends BaseEntity {
  id_pessoa_dado_adicional_tipo: number;
  id_pessoa: number;
  descricao: string;
}
