import { BaseEntity } from './base.type';
import { Pessoas } from './pessoa.type';
import { PessoasJuridicasJuridicas } from './pessoasJuridicasJuridicas.type';
import { PessoasOrigens } from './pessoasOrigens.type';
import { PessoasTipo } from './pessoaTipo.type';

export interface PessoasJuridicas extends BaseEntity {
  id_pessoa: number;
  id_pessoa_fisica_responsavel?: number;
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  insc_estadual?: string;
  insc_municipal?: string;
  filial_principal?: number;
}

// Manter interface legada para compatibilidade
export interface Empresa extends BaseEntity {
  id_pessoa: number;
  id_pessoa_fisica_responsavel: number;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  insc_estadual: string;
  insc_municipal: string;
  filial_principal: number;
  pessoa?: Pessoas;
  pessoaTipo?: PessoasTipo;
  pessoaOrigem?: PessoasOrigens;
  vinculoJuridico?: PessoasJuridicasJuridicas[];
}
