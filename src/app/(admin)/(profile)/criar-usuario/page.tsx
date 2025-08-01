'use client';

import { UserFormBase, UserFormData } from '@/components/form/user/UserForm';

export default function CreateUserPage() {
  const handleCreate = (data: UserFormData) => {
    console.log('Novo usuário criado:', data);
  };

  return <UserFormBase mode="create" onSubmit={handleCreate} />;
}
