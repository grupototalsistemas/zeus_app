import { BaseEntity } from './base.type';

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
}
