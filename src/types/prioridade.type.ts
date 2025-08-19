import { BaseEntity } from './base.type';

export interface Prioridade extends BaseEntity {
  id?: number;
  empresaId: number;
  descricao: string;
  cor: string;
  tempoResolucao: string; // formato HH:mm:ss
}
