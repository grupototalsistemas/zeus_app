import { BaseEntity, MovimentoDto } from './base.type';
import { StatusRegistro } from './enum';

export interface Chamado extends BaseEntity {
  id?: number;
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
  createdAt?: string;
  updatedAt?: string;
  movimentos?: MovimentoDto[];
  ativo?: StatusRegistro;
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
