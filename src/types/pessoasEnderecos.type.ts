import { BaseEntity } from './base.type';

export interface PessoasEnderecos extends BaseEntity {
  id_pessoa: number;
  id_pessoa_endereco_tipo: number;
  logradouro: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  municipio_ibge?: string;
  estado: string;
  cep: string;
}
