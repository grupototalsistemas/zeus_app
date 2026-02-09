import { BaseEntity } from './base.type';

export interface PessoasJuridicasSistemas extends BaseEntity {
  id_pessoa_juridica: number;
  id_sistema: number;
}

// Manter interface legada para compatibilidade
export interface EmpresaSistema extends BaseEntity {
  empresaId: number;
  sistemaId: number;
  versao: string;
}
