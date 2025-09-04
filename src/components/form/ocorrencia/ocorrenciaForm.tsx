'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { selectOcorrenciaTipos } from '@/store/slices/ocorrenciaTipoSlice';
import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export interface OcorrenciaFormData {
  id?: number;
  empresaId: number;
  descricao: string;
  tipoId: number;
  ativo: StatusRegistro;
}

interface OcorrenciaFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Ocorrencia;
  onSubmit: (data: OcorrenciaFormData) => void;
  disabled?: boolean;
}

export function OcorrenciaFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: OcorrenciaFormBaseProps) {
  const empresas = useSelector(selectEmpresas);
  const tipos = useSelector(selectOcorrenciaTipos);
  const router = useRouter();
  console.log('initial  data:', initialData);
  const [formData, setFormData] = useState<OcorrenciaFormData>({
    id: initialData?.id,
    empresaId: initialData?.empresaId || 0,
    descricao: initialData?.descricao || '',
    ativo: initialData?.ativo || StatusRegistro.ATIVO,
    tipoId: initialData?.tipoId || 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        empresaId: initialData.empresaId,
        descricao: initialData.descricao,
        ativo: initialData.ativo || StatusRegistro.ATIVO,
        tipoId: initialData.tipoId,
      });
    }
  }, [initialData]);

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
      title={`${mode === 'create' ? 'Criar' : 'Editar'} Ocorrencia`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Descrição */}
          <div>
            <Label>Ocorrencia</Label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Informe um nome para a Ocorrencia"
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

        <div>
          <Label>Tipo de Ocorrência</Label>
          <select
            value={formData.tipoId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange('tipoId', Number(e.target.value))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            required
            disabled={disabled}
          >
            <option value="">Selecione um tipo de ocorrência</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descricao}
              </option>
            ))}
          </select>
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
            {mode === 'create' ? 'Criar Ocorrência' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
