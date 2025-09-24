'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { ChamadoMovimentoEtapa } from '@/types/chamadoMovimentoEtapa.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

export interface EtapaMovimentoFormData {
  empresaId: number;
  descricao: string;
  ativo: StatusRegistro;
}

interface EtapaMovimentoFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: ChamadoMovimentoEtapa;
  onSubmit: (data: EtapaMovimentoFormData) => void;
  disabled?: boolean;
}

export function EtapaMovimentoFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: EtapaMovimentoFormBaseProps) {
  const empresas = useSelector(selectEmpresas);
  const router = useRouter();
  const [formData, setFormData] = useState<EtapaMovimentoFormData>({
    empresaId: initialData?.empresaId || 0,
    descricao: initialData?.descricao || '',
    ativo: initialData?.ativo || StatusRegistro.ATIVO,
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
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      router.back();
    }
  };

  return (
    <ComponentCard
      title={`${mode === 'create' ? 'Criar' : 'Editar'} Tipo de Movimento`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
          {/* Descrição */}
          <div>
            <Label>Tipo de Movimento</Label>
            <Input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Informe um nome para o tipo de Movimento"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              disabled={disabled}
            />
          </div>
          <div>
            <EmpresaAutocomplete
              disabled={disabled}
              empresaId={initialData?.empresaId.toString() || ''}
              onSelect={(empresa) =>
                handleChange('empresaId', empresa?.id || 0)
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
          <Button onClick={handleCancel} disabled={disabled} variant="outline">
            Cancelar
          </Button>
          <Button disabled={disabled}>
            {mode === 'create'
              ? 'Criar Tipo de Movimento'
              : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
