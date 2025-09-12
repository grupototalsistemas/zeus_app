'use client';

import {
  SistemaFormBase,
  SistemaFormData,
} from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';
import { useSistema } from '@/hooks/useSistema';
import { StatusRegistro } from '@/types/enum';
import { Sistema } from '@/types/sistemas.type';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateUserPage() {
  const { id } = useParams();
  const { update, getById, currentSistema } = useSistema();
  const handleUpdate = async (data: SistemaFormData) => {
    const sistema: Sistema = parseSistema(data);
    // console.log('Novo usuário criado (DTO):', sistema);
    update(data.id || 0, sistema);
  };

  useEffect(() => {
    if (id) {
      getById(Number(id));
    }
  }, []);

  const parseSistema = (data: SistemaFormData): Sistema => {
    return {
      empresaId: Number(data.empresaId),
      descricao: data.descricao,
      nome: data.nome,
      ativo: StatusRegistro.ATIVO,
    };
  };

  return (
    <>
      {currentSistema && (
        <SistemaFormBase
          mode="edit"
          onSubmit={handleUpdate}
          initialData={currentSistema}
        />
      )}
      <br />
      <SistemaList />
    </>
  );
}
