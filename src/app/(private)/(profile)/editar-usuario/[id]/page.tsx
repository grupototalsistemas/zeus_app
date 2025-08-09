'use client';

import { UserFormBase, UserFormData } from '@/components/form/user/UserForm';
import { users } from '@/components/tables/user.example';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const found = users.find((u) => u.id === id);
    setUser(found || null);
  }, [id]);

  const handleEdit = (data: UserFormData) => {
    console.log('Usuário atualizado:', data);
  };

  if (!user) return <div>Carregando...</div>;

  return <UserFormBase mode="edit" initialData={user} onSubmit={handleEdit} />;
}
