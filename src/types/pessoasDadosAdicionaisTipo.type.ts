import { BaseEntity } from './base.type';

export interface PessoasDadosAdicionaisTipo extends BaseEntity {
  id_pessoa: number;
  descricao: string;
}
