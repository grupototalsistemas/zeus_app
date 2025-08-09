
import { BaseEntity } from "./base.type";
export interface Prioridade extends BaseEntity{
  id_prioridade: number;
  id_empresa: number;
  descricao: string;
  cor: string;
  tempo_resolucao: string; // formato HH:mm:ss
  
}
