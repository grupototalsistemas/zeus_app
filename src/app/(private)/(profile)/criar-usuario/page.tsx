'use client';

import { UserFormBase, UserFormData } from '@/components/form/user/UserForm';
import { PessoaService } from '@/service/pessoa.service';
import { StatusGenero, StatusRegistro } from '@/types/enum';
import { PessoaUsuarioDTO } from '@/types/pessoaUsuario.type';

export default function CreateUserPage() {
  const handleCreate = async (data: UserFormData) => {
    const usuario: PessoaUsuarioDTO = parseUsuario(data);
    console.log('Novo usuário criado (DTO):', usuario);
    await PessoaService.createPessoaUsuario(usuario);
  };

  const parseUsuario = (data: UserFormData): PessoaUsuarioDTO => {
    return {
      login: data.login,
      email: data.email,
      senha: data.senha,
      perfilId: Number(data.perfil),
      pessoa: {
        empresaId: Number(data.empresa),
        tipoId: Number(data.funcao),
        genero: data.genero as StatusGenero,
        nome: data.nome,
        nomeSocial: data.nome_social || '',
        ativo: StatusRegistro.Ativo,
      },
    };
  };

  return <UserFormBase mode="create" onSubmit={handleCreate} />;
}
