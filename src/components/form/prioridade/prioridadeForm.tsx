'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { StatusRegistro } from '@/types/enum';
import { Prioridade } from '@/types/prioridade.type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ColorPicker from 'react-pick-color';
import DatePicker from '../date-picker';

export interface PrioridadeFormData {
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
    <ComponentCard title={`${mode === 'create' ? 'Criar' : 'Editar'} Tempo de Execução`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Descrição */}
          <div>
            <Label>Informe um nome para o tempo de execução</Label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Digite a descrição da função"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Empresa</Label>
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
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Descrição */}
          <div>
            <Label>Escolha uma cor para representar a prioridade</Label>
            {/* <input
              type="text"
              value={formData.cor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('cor', e.target.value)
              }
              placeholder="Digite a cor da prioridade"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
              disabled={disabled}
            /> */}
            <ColorPicker color={formData.cor} onChange={color => handleChange('cor', color.hex)} />
          </div>
          <div>
            <Label>Informe o tempo limite para essa prioridade</Label>
            
            <DatePicker
              id='tempo'
              defaultDate={formData.tempo}
              onChange={(date) => handleChange('tempo', date.toString())}
              mode='single'
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
            {mode === 'create' ? 'Criar Função' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
