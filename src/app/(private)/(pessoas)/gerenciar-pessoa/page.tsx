'use client';

import {
  PessoaFormBase,
  PessoaFormData,
} from '@/components/form/pessoa/PessoaForm';
import { PessoaService } from '@/service/pessoa.service';
import { StatusGenero, StatusRegistro } from '@/types/enum';
import { Pessoa } from '@/types/pessoa.type';

export default function CreatePessoaPage() {
  const handleCreate = async (data: PessoaFormData) => {
    const pessoa: Pessoa = parsePessoa(data);
    console.log('Novo usuário criado (DTO):', pessoa);
    await PessoaService.createPessoa(pessoa);
  };

  const parsePessoa = (data: PessoaFormData): Pessoa => {
    return {
      empresaId: Number(data.empresaId),
      tipoId: Number(data.tipoId),
      genero: data.genero as StatusGenero,
      nome: data.nome,
      nomeSocial: data.nomeSocial || '',
      ativo: StatusRegistro.ATIVO,
    };
  };

  return (
    <>
      <PessoaFormBase mode="create" onSubmit={handleCreate} />
    </>
  );
}
