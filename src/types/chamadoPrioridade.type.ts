import { BaseEntity } from './base.type';

export interface Prioridade extends BaseEntity {
  id_empresa: number;
  descricao: string;
  cor: string;
  tempoResolucao: string;
}
