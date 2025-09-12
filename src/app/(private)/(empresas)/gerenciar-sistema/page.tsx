'use client';

import {
  SistemaFormBase,
  SistemaFormData,
} from '@/components/form/sistema/SistemaForm';
import SistemaList from '@/components/tables/SistemaList';
import { useSistema } from '@/hooks/useSistema';
import { StatusRegistro } from '@/types/enum';
import { Sistema } from '@/types/sistemas.type';

export default function CreateUserPage() {
  const { create } = useSistema();
  const handleCreate = async (data: SistemaFormData) => {
    const sistema: Sistema = parseUsuario(data);
    create(sistema);
  };

  const parseUsuario = (data: SistemaFormData): Sistema => {
    return {
      empresaId: Number(data.empresaId),
      descricao: data.descricao,
      motivo: data.motivo,
      nome: data.nome,
      ativo: StatusRegistro.ATIVO,
    };
  };

  return (
    <>
      <SistemaFormBase mode="create" onSubmit={handleCreate} />
      <br />
      <SistemaList />
    </>
  );
}
