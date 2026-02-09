import { BaseEntity } from './base.type';

export interface ModulosPerfisPermissoes extends BaseEntity {
  id_modulo: number;
  id_pessoa_juridica_perfil: number;
  action_insert?: number;
  action_update?: number;
  action_search?: number;
  action_delete?: number;
  action_print?: number;
}
