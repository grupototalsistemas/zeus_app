import { BaseEntity } from './base.type';

export interface ChamadoMovimentoAnexo extends BaseEntity {
  id_chamado_movimento: number;
  id_pessoa_usuario: number;
  ordem?: number;
  descricao: string;
  dataHora?: string;
  caminho: string;
}
