import { BaseEntity } from "./base.type";


export interface Chamado extends BaseEntity {
  id_chamado?: number;
  id_empresa: number;
  id_sistema: number;
  id_pessoa_empresa: number;
  id_pessoa_usuario: number;
  id_ocorrencia: number;
  id_prioridade: number;
  protocolo?: number;
  titulo: string;
  descricao: string;
  observacao: string;
}
