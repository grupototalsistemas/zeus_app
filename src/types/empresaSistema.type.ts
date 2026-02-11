import { BaseEntity } from './base.type';

export interface PessoasJuridicasSistemas extends BaseEntity {
  id_pessoa_juridica: number;
  id_sistema: number;
  sistema?: {
    id: number | string;
    nome?: string;
    sistema?: string;
    descricao?: string;
  };
}

// Manter interface legada para compatibilidade
export interface EmpresaSistema extends BaseEntity {
  empresaId: number;
  sistemaId: number;
  versao: string;
  sistema?: {
    id: number | string;
    nome?: string;
    sistema?: string;
    descricao?: string;
  };
}
