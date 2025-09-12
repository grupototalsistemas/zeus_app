'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { EmpresaTipo } from '@/types/empresaTipo.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

export interface TipoEmpresaFormData {
  id: number;
  descricao: string;
  empresaId: number;
  ativo: StatusRegistro;
  motivo?: string;
}

interface TipoEmpresaFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: EmpresaTipo;
  onSubmit: (data: TipoEmpresaFormData) => void;
  disabled?: boolean;
}

export function TipoEmpresaFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: TipoEmpresaFormBaseProps) {
  const empresas = useSelector(selectEmpresas);
  const router = useRouter();
  const [formData, setFormData] = useState<TipoEmpresaFormData>({
    id: initialData?.id || 0,
    empresaId: initialData?.empresaId || 0,
    descricao: initialData?.descricao || '',
    ativo: initialData?.ativo || StatusRegistro.ATIVO,
    motivo: initialData?.motivo || '',
  });

  const handleChange = (name: string, value: any) => {
    if (!disabled) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      onSubmit(formData);
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
        <div className="grid grid-cols-2 gap-6">
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
          <div>
            <EmpresaAutocomplete
              onSelect={(empresa) =>
                handleChange('empresaId', empresa?.id || 0)
              }
              disabled={disabled}
              empresaId={initialData?.empresaId.toString()}
            />
            {/* <Label>Empresa</Label>
            <select
              value={formData.empresaId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange('empresaId', Number(e.target.value))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
              disabled={disabled}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nomeFantasia}
                </option>
              ))}
            </select> */}
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
