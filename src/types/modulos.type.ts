import { BaseEntity } from './base.type';

export interface Modulos extends BaseEntity {
  id_parent: number;
  name_form_page: string;
  component_index: string;
  component_name: string;
  component_text: string;
  component_event?: string;
  shortcutkeys?: string;
  status_visible?: number;
}
