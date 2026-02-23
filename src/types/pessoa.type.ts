import { BaseEntity } from './base.type';
import { PessoasContatos } from './pessoasContatos.type';
import { PessoasDadosAdicionais } from './pessoasDadosAdicionais.type';
import { PessoasEnderecos } from './pessoasEnderecos.type';

export interface Pessoas extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  chave?: string;
  senha?: string;
  codigo?: string;
  pessoasEnderecos?: PessoasEnderecos[];
  pessoasContatos?: PessoasContatos[];
  pessoasDadosAdicionais?: PessoasDadosAdicionais[];
}

export interface PessoaResponse extends BaseEntity {
  id_pessoa_tipo: number;
  id_pessoa_origem: number;
  pessoa: number;
  codigo?: string;
  chave?: string;
  senha?: string;
  pessoasEnderecos?: PessoasEnderecos[];
  pessoasContatos?: PessoasContatos[];
  pessoasDadosAdicionais?: PessoasDadosAdicionais[];
}

export interface PessoaFisicaResponse extends PessoaResponse {
  id_pessoa_juridica_perfil: string;
  pessoaFisica: {
    id: string;
    id_pessoa: string;
    id_pessoa_genero: string;
    id_pessoa_estado_civil: string;
    cpf_justificativa: number;
    cpf: string;
    nome_registro: string;
    nome_social: string;
    doc_numero: string | null;
    doc_emissor: string | null;
    doc_data_emissao: string | null;
    nacionalidade: string | null;
    naturalidade: string | null;
    data_nascimento: string | null;
    situacao: number;
    motivo: string | null;
    createdAt: string;
    updatedAt: string | null;
    pessoasUsuarios: [
      {
        id: string;
        id_pessoa_fisica: string;
        nome_login: string;
        login: string;
        senha: string | null;
        senha_master: string | null;
        first_access: number;
        situacao: number;
        motivo: string | null;
        createdAt: string;
        updatedAt: string | null;
      },
    ];
    pessoa: {
      id: string;
      pessoasContatos: PessoasContatos[];
      pessoasEnderecos: PessoasEnderecos[];
      pessoasDadosAdicionais: PessoasDadosAdicionais[];
    };
  };
  pessoaJuridica: {
    id: string;
    id_pessoa: string;
    id_pessoa_fisica_responsavel: string;
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    insc_estadual: string | null;
    insc_municipal: string | null;
    filial_principal: number;
    situacao: number;
    motivo: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
}
