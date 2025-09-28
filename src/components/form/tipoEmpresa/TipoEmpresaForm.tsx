'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { useEmpresaTipo } from '@/hooks/useEmpresaTipo';
import { EmpresaTipo } from '@/types/empresaTipo.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Input from '../input/InputField';

interface TipoEmpresaFormBaseProps {
  mode: 'create' | 'edit';
  id: string | undefined;
  disabled?: boolean;
}

export function TipoEmpresaFormBase({
  mode,
  id,
  disabled = false,
}: TipoEmpresaFormBaseProps) {
  const { create, getById, update } = useEmpresaTipo();
  const router = useRouter();
  const [initialData, setInitialData] = useState<EmpresaTipo>();
  const [formData, setFormData] = useState<EmpresaTipo>({
    id: initialData?.id || 0,
    descricao: initialData?.descricao || '',
    ativo: initialData?.ativo || StatusRegistro.ATIVO,
    motivo: initialData?.motivo || '',
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      getById(Number(id)).then((response) => {
        if (response.payload) {
          const aux: EmpresaTipo = {
            id: response.payload.id,
            ativo: response.payload.ativo,
            descricao: response.payload.descricao,
            motivo: response.payload.motivo || '',
          };
          setInitialData(aux);
          setFormData(aux);
        }
      });
    }
  }, []);

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
      setFormData({ descricao: '', ativo: StatusRegistro.ATIVO, motivo: '' });
      router.replace('/gerenciar-tipo-empresa');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      const { id, motivo, ...rest } = formData;
      await update(id || 0, rest);
      router.replace('/gerenciar-tipo-empresa');
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      router.replace('/gerenciar-tipo-empresa');
    }
  };

  return (
    <ComponentCard
      title={`${mode === 'create' ? 'Criar' : 'Editar'} Tipo de Empresa`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Descrição */}
          <div>
            <Label>Informe um nome para o tipo de empresa</Label>
            <Input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Digite o tipo de empresa"
              disabled={disabled}
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
          <Button onClick={handleCancel} disabled={disabled} variant="outline">
            Cancelar
          </Button>
          <Button disabled={disabled}>
            {mode === 'create' ? 'Criar Tipo' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
