import { BaseEntity } from './base.type';
import { PessoasContatos } from './pessoasContatos.type';
import { PessoasDadosAdicionais } from './pessoasDadosAdicionais.type';
import { PessoasEnderecos } from './pessoasEnderecos.type';

export interface Pessoas extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  chave?: string;
  senha?: string;
  codigo?: string;
  pessoasEnderecos?: PessoasEnderecos[];
  pessoasContatos?: PessoasContatos[];
  pessoasDadosAdicionais?: PessoasDadosAdicionais[];
}

export interface PessoaResponse extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  codigo?: string;
  chave?: string;
  senha?: string;
  pessoasEnderecos?: PessoasEnderecos[];
  pessoasContatos?: PessoasContatos[];
  pessoasDadosAdicionais?: PessoasDadosAdicionais[];
}
