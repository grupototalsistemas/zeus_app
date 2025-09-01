import { BaseEntity } from './base.type';

export interface Prioridade extends BaseEntity {
  empresaId: number;
  descricao: string;
  cor: string;
  tempo: string; // formato HH:mm:ss
}
