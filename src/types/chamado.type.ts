import { BaseEntity, MovimentoDto } from './base.type';
import { ChamadoMovimento } from './chamadoMovimento.type';
import { PessoasJuridicas } from './empresa.type';
import { StatusRegistro } from './enum';
import { PessoasFisica } from './pessoasFisica.type';
import { PessoasUsuarios } from './pessoaUsuario.type';
import { Sistemas } from './sistemas.type';

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
  pessoaFisica: PessoasFisica;
  usuario?: PessoasUsuarios;
  sistema: Sistemas;
  empresa: PessoasJuridicas;
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

export interface MetricasChamado {
  totalChamados: number;
  chamadosAbertos: number;
  chamadosFechados: number;
  chamadosPorSistema: any[];
  chamadosPorPrioridade: any[];
  chamadosAbertosPorDia: any[];
  chamadosFechadosPorDia: any[];
}
