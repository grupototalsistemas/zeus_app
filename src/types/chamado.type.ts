import { BaseEntity, MovimentoDto } from './base.type';
import { ChamadoMovimento } from './chamadoMovimento.type';
import { StatusRegistro } from './enum';

export interface Chamado extends BaseEntity {
  empresaId: number;
  sistemaId: number;
  pessoaId: number;
  usuarioId: number;
  ocorrenciaId: number;
  prioridadeId: number;
  protocolo?: number;
  titulo: string;
  descricao: string;
  observacao: string;
  movimentos?: ChamadoMovimento[];
}

// DTO principal de criação de chamado
export interface CreateChamadoDto {
  empresaId: number;
  sistemaId: number;
  pessoaId: number;
  usuarioId: number;
  ocorrenciaId: number;
  prioridadeId: number;
  protocolo?: string;
  titulo: string;
  descricao: string;
  observacao?: string;
  movimento?: MovimentoDto; // movimento inicial opcional
  ativo?: StatusRegistro;
  anexos?: File[]; // arquivos anexados
}
