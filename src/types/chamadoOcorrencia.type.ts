import { BaseEntity } from './base.type';
import { OcorrenciaTipo } from './chamadoOcorrenciaTipo.type';

export interface Ocorrencia extends BaseEntity {
  id_ocorrencia_tipo: number;
  id_empresa: number;
  descricao: string;
  tipo?: OcorrenciaTipo;
}
