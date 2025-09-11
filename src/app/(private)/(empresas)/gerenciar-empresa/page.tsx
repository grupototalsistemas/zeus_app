'use client';

import {
  EmpresaFormBase,
  EmpresaFormData,
} from '@/components/form/empresa/EmpresaForm';
import { EmpresaService } from '@/service/empresa.service';
import { Empresa } from '@/types/empresa.type';
import { StatusRegistro, StatusSiglaEstado } from '@/types/enum';

export default function CreateEmpresaPage() {
  const handleCreate = async (data: EmpresaFormData) => {
    const empresa: Empresa = parseEmpresa(data);
    console.log('Nova empresa criada (DTO):', empresa);
    await EmpresaService.createEmpresa(empresa);
  };

  const parseEmpresa = (data: EmpresaFormData): Empresa => {
    return {
      parentId: Number(data.parentId),
      tipoId: Number(data.tipoId),
      categoriaId: Number(data.categoriaId),
      cnpj: data.cnpj,
      codigo: data.codigo,
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia,
      logradouro: data.logradouro,
      endereco: data.endereco,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado as StatusSiglaEstado,
      cep: data.cep,
      observacao: data.observacao,
      contato: data.contato,
      email: data.email,
      motivo: '',
      ativo: StatusRegistro.ATIVO,
    };
  };

  return (
    <>
      <EmpresaFormBase mode="create" onSubmit={handleCreate} />
    </>
  );
}
