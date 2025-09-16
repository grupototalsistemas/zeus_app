'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { Prioridade } from '@/types/chamadoPrioridade.type';
import { StatusRegistro } from '@/types/enum';
import ColorSlider from '@/utils/ColorSlider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

export interface PrioridadeFormData {
  id?: number;
  descricao: string;
  empresaId: number;
  cor: string;
  tempo: string;
  ativo: StatusRegistro;
  motivo?: string;
}

interface PrioridadeFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Prioridade;
  onSubmit: (data: PrioridadeFormData) => void;
  disabled?: boolean;
}

export function PrioridadeFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: PrioridadeFormBaseProps) {
  const empresas = useSelector(selectEmpresas);
  const router = useRouter();
  const [formData, setFormData] = useState<PrioridadeFormData>({
    id: initialData?.id || 0,
    empresaId: initialData?.empresaId || 0,
    descricao: initialData?.descricao || '',
    cor: initialData?.cor || '#fff',
    tempo: initialData?.tempo || '',
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
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      router.back();
    }
  };

  return (
    <ComponentCard
      title={`${mode === 'create' ? 'Criar' : 'Editar'} Tempo de Execução`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Descrição */}
          <div>
            <Label>Informe um nome para o tempo de execução</Label>
            <Input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Digite a descrição da função"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              disabled={disabled}
            />
          </div>
          <div>
            <EmpresaAutocomplete
              empresaId={initialData?.empresaId.toString() || ''}
              onSelect={(empresa) =>
                handleChange('empresaId', empresa?.id || 0)
              }
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Descrição */}
          <div>
            <Label>Escolha uma cor para representar a prioridade</Label>
            <ColorSlider
              value={formData.cor}
              onChange={(color) => handleChange('cor', color)}
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Informe o tempo limite em minutos</Label>
            <div className="mt-1">
              <Input
                type="number"
                min="1"
                value={formData.tempo || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange('tempo', String(Number(e.target.value)));
                }}
                placeholder="Digite o tempo em minutos"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Digite o tempo em minutos (ex: 30 para meia hora, 60 para uma
                hora, 120 para duas horas)
              </p>
            </div>
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
            {mode === 'create' ? 'Criar Prioridade' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
