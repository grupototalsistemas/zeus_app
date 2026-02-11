import { BaseEntity } from './base.type';
import { Chamado } from './chamado.type';
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

export interface EmpresaSistemaResumo {
  id: number | string;
  nome?: string;
  sistema?: string;
  descricao?: string;
}

export interface PessoaJuridicaSistemaVinculo {
  sistema: EmpresaSistemaResumo;
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
  pessoasJuridicasSistemas?: PessoaJuridicaSistemaVinculo[];
  chamados?: Chamado[]; // Substituir por tipo especifico de Chamado quando disponivel
}
