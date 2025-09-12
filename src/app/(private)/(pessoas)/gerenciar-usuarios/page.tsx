'use client';

import { UserFormBase, UserFormData } from '@/components/form/user/UserForm';
import UserList from '@/components/tables/UserList';
import { PessoaService } from '@/service/pessoa.service';
import { PessoaUsuario } from '@/types/pessoaUsuario.type';

export default function CreateUserPage() {
  const handleCreate = async (data: UserFormData) => {
    const usuario: PessoaUsuario = parseUsuario(data);
    console.log('Novo usuário criado (DTO):', usuario);
    await PessoaService.createPessoaUsuario(usuario);
  };

  const parseUsuario = (data: UserFormData): PessoaUsuario => {
    return {
      login: data.login,
      email: data.email,
      senha: data.senha,
      perfilId: Number(data.perfilId),
      pessoaId: Number(data.pessoaId),
    };
  };

  return (
    <>
      <UserFormBase mode="create" onSubmit={handleCreate} />
      <br />
      <UserList />
    </>
  );
}
