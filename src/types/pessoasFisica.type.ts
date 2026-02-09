import { BaseEntity } from './base.type';

export interface PessoasFisica extends BaseEntity {
  id_pessoa: number;
  id_pessoa_genero: number;
  id_pessoa_estado_civil: number;
  cpf_justificativa: number;
  cpf?: string;
  nome_registro: string;
  nome_social?: string;
  doc_numero?: string;
  doc_emissor?: string;
  doc_data_emissao?: string;
  nacionalidade?: string;
  naturalidade?: string;
  data_nascimento?: string;
}
