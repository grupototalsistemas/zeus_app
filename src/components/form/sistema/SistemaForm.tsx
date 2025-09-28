'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { useSistema } from '@/hooks/useSistema';
import { StatusRegistro } from '@/types/enum';
import { Sistema } from '@/types/sistemas.type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

interface SistemaFormBaseProps {
  mode: 'create' | 'edit';

  id: string | undefined;
  disabled?: boolean;
}

export function SistemaFormBase({
  mode,
  id,
  disabled = false,
}: SistemaFormBaseProps) {
  const router = useRouter();

  const [resetSelection, setResetSelection] = useState<boolean>(false);

  const [formData, setFormData] = useState<Sistema>({
    id: 0,
    empresaId: 0,
    descricao: '',
    nome: '',
    ativo: StatusRegistro.ATIVO,
    motivo: '',
  });

  const { create, getById, update } = useSistema();

  useEffect(() => {
    if (mode === 'edit' && id) {
      getById(Number(id)).then((response) => {
        const data: Sistema = response.payload;
        setFormData(data);
      });
    }
  }, []);

  useEffect(() => {
    setFormData({
      id: 0,
      empresaId: 0,
      descricao: '',
      nome: '',
      ativo: StatusRegistro.ATIVO,
      motivo: '',
    });
    setResetSelection(false);
  }, [resetSelection]);

  const handleChange = (name: string, value: any) => {
    if (!disabled) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'create') {
      handleCreate(e);
    } else {
      handleUpdate(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      const { id, motivo, ...rest } = formData;
      await create(rest);
      setResetSelection(true);
      router.replace('/gerenciar-sistema');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      const { id, createdAt, updatedAt, ...rest } = formData;
      await update(Number(id), rest);

      router.replace('/gerenciar-sistema');
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      router.replace('/gerenciar-sistema');
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Sistemas" pageBefore="Empresas" />
      <ComponentCard
        title={`${mode === 'create' ? 'Criar' : 'Editar'} Sistema`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
            {/* Descrição */}
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('nome', e.target.value)
                }
                placeholder="Informe um nome para o Sistema"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                disabled={disabled}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                type="text"
                value={formData.descricao}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('descricao', e.target.value)
                }
                placeholder="Informe uma descrição para o Sistema"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                disabled={disabled}
              />
            </div>
            <div>
              <EmpresaAutocomplete
                onSelect={(empresa) =>
                  handleChange('empresaId', empresa?.id || 0)
                }
                resetSelection={resetSelection}
                disabled={disabled}
                empresaId={formData.empresaId.toString()}
              />
            </div>
            <div>
              <Label>Motivo</Label>
              <Input
                type="text"
                placeholder={
                  mode === 'create'
                    ? 'Informe um motivo para o Sistema'
                    : 'Informe um motivo para alterar o Sistema'
                }
                value={formData.motivo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('motivo', e.target.value)
                }
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Label>Status</Label>
            <Switch
              defaultChecked={formData.ativo === StatusRegistro.ATIVO}
              onChange={(checked) =>
                handleChange(
                  'ativo',
                  checked ? StatusRegistro.ATIVO : StatusRegistro.INATIVO
                )
              }
              color={formData.ativo === StatusRegistro.ATIVO ? 'blue' : 'gray'}
              label={
                formData.ativo === StatusRegistro.ATIVO ? 'Ativo' : 'Inativo'
              }
              disabled={disabled}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleCancel}
              disabled={disabled}
              variant="outline"
              type="button"
            >
              Cancelar
            </Button>
            <Button disabled={disabled}>
              {mode === 'create' ? 'Criar Sistema' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
