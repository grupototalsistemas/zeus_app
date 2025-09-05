import { BaseEntity } from './base.type';
import { OcorrenciaTipo } from './chamadoOcorrenciaTipo.type';

export interface Ocorrencia extends BaseEntity {
  tipoId: number;
  empresaId: number;
  descricao: string;
  tipo?: OcorrenciaTipo;
}
