import { ChamadoMovimentoEtapa } from './chamadoMovimentoEtapa.type';
import { StatusRegistro } from './enum';

/** Campos padrão de todas as entidades */
export interface BaseEntity {
  ativo?: StatusRegistro;
  motivo?: string;
}

// ================= DTOs =================

// Criação de Anexo
export interface AnexoDto {
  usuarioId: number;
  descricao: string;
  caminho: string;
}

// Criação de Mensagem
export interface MensagemDto {
  usuarioEnvioId: number;
  usuarioLeituraId: number;
  descricao: string;
}

// Criação de Movimento
export interface MovimentoDto {
  etapaId: number;
  etapa?: ChamadoMovimentoEtapa;
  ordem?: number;
  usuarioId: number;
  createdAt?: string;
  descricaoAcao: string;
  observacaoTec?: string;
  anexos?: AnexoDto[];
  mensagens?: MensagemDto[];
}

// DTO principal de criação de chamado
// export interface CreateChamadoDto {
//   empresaId: number;
//   sistemaId: number;
//   pessoaId: number;
//   usuarioId: number;
//   ocorrenciaId: number;
//   prioridadeId: number;
//   protocolo?: number;
//   titulo: string;
//   descricao: string;
//   observacao?: string;
//   movimento?: MovimentoDto; // movimento inicial opcional
//   ativo?: StatusRegistro;
// }

// DTO de atualização
export interface UpdateChamadoDto {
  titulo?: string;
  descricao?: string;
  observacao?: string;
  prioridadeId?: number;
  movimento?: MovimentoDto; // movimento adicional
  usuarioId?: number; // precisa vir no update tb
}
