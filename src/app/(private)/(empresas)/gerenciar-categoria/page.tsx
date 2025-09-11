'use client';

import {
  CategoriaEmpresaFormBase,
  CategoriaEmpresaFormData,
} from '@/components/form/categoria_empresa/CategoriaEmpresaForm';
import CategoriaEmpresaList from '@/components/tables/CategoriaEmpresa';
import { EmpresaCategoriaService } from '@/service/empresaCategoria.service';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import { StatusRegistro } from '@/types/enum';

export default function CreateCategoriaEmpresaPage() {
  const handleCreate = async (data: CategoriaEmpresaFormData) => {
    const categoria: EmpresaCategoria = parseUsuario(data);
    await EmpresaCategoriaService.createEmpresaCategoria(categoria);
  };

  const parseUsuario = (data: CategoriaEmpresaFormData): EmpresaCategoria => {
    return {
      empresaId: Number(data.empresaId),
      descricao: data.descricao,
      ativo: StatusRegistro.ATIVO,
    };
  };

  return (
    <>
      <CategoriaEmpresaFormBase mode="create" onSubmit={handleCreate} />
      <br />
      <CategoriaEmpresaList />
    </>
  );
}
