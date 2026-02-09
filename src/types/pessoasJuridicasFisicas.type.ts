import { BaseEntity } from './base.type';

export interface PessoasJuridicasFisicas extends BaseEntity {
  id_pessoa_juridica: number;
  id_pessoa_fisica: number;
  id_pessoa_juridica_perfil: number;
  juridica_principal?: number;
}
