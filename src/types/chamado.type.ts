import { BaseEntity, MovimentoDto } from './base.type';
import { ChamadoMovimento } from './chamadoMovimento.type';
import { StatusRegistro } from './enum';

export interface Chamado extends BaseEntity {
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
  movimentos?: ChamadoMovimento[];
}

// DTO principal de criação de chamado
export interface CreateChamadoDto {
  id_pessoa_juridica: number;
  id_sistema: number;
  id_pessoa_empresa: number;
  id_pessoa_usuario: number;
  id_ocorrencia: number;
  id_prioridade: number;
  protocolo?: string;
  titulo: string;
  descricao: string;
  observacao?: string;
  movimento?: MovimentoDto; // movimento inicial opcional
  situacao?: StatusRegistro;
  anexos?: File[]; // arquivos anexados
}
