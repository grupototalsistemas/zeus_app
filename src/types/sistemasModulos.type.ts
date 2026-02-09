import { BaseEntity } from './base.type';

export interface SistemasModulos extends BaseEntity {
  id_sistema: number;
  id_modulo_principal: number;
}
