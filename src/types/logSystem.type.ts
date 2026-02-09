import { BaseEntity } from './base.type';

export interface LogSystem extends BaseEntity {
  id_pessoa_juridica_empresa: number;
  id_pessoa_fisica_usuario: number;
  id_pessoa_juridica_fisica_perfil: number;
  id_modulo_perfil_permissao: number;
  endpoint_name: string;
  device: string;
  user_win?: string;
  computer_name?: string;
  action_page: string;
  table_name?: string;
  table_id_name?: string;
  table_id_value?: number;
  table_id_value_str?: string;
  table_data_before?: any;
  table_data_after?: any;
  error_status?: number;
  error_message?: string;
}
