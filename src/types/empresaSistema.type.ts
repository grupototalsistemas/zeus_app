import { BaseEntity } from "./base.type";

export interface EmpresaSistema extends BaseEntity {
  id_empresa_sistema: number;
  id_empresa: number;
  id_sistema: number;
  versao: string;

}
