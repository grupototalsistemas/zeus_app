import { BaseEntity } from './base.type';

export interface EmpresaSistema extends BaseEntity {
  empresaId: number;
  sistemaId: number;
  versao: string;
}
