'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { StatusRegistro } from '@/types/enum';
import { Perfil } from '@/types/pessoaPerfil.type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export interface PerfilFormData {
  descricao: string;
  empresaId: number;
  ativo: StatusRegistro;
  motivo?: string;
}

interface PerfilFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Perfil;
  onSubmit: (data: PerfilFormData) => void;
  disabled?: boolean;
}

export function PerfilFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: PerfilFormBaseProps) {
  const router = useRouter();
  const empresas = useSelector(selectEmpresas);
  const [formData, setFormData] = useState<PerfilFormData>({
    descricao: initialData?.descricao || '',
    empresaId: initialData?.empresaId || 0,
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
    <ComponentCard title={`${mode === 'create' ? 'Criar' : 'Editar'} Perfil`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Nome do Perfil */}
          <div>
            <Label>Nome do Perfil</Label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Digite o nome do perfil"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
              disabled={disabled}
            />
          </div>

          {/* Empresa */}
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

        {/* Descrição */}
        <div>
          <Label>Descrição</Label>
          <textarea
            value={formData.motivo}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleChange('motivo', e.target.value)
            }
            placeholder="Digite um motivo para criação do perfil (opcional)"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            disabled={disabled}
          />
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
            {mode === 'create' ? 'Criar Perfil' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
