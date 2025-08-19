import { BaseEntity } from './base.type';
import { StatusRegistro } from './enum';

export interface Prioridade extends BaseEntity {
  id?: number;
  empresaId: number;
  descricao: string;
  cor: string;
  tempo: string; // formato HH:mm:ss
  ativo: StatusRegistro;
  motivo?: string;
}
