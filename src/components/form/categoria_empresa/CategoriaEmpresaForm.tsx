'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { selectEmpresas } from '@/store/slices/empresaSlice';
import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

export interface CategoriaEmpresaFormData {
  id?: number;
  empresaId: number;
  descricao: string;
  ativo: StatusRegistro;
}

interface CategoriaEmpresaFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: OcorrenciaTipo;
  onSubmit: (data: CategoriaEmpresaFormData) => void;
  disabled?: boolean;
}

export function CategoriaEmpresaFormBase({
  mode,
  initialData,
  onSubmit,
  disabled = false,
}: CategoriaEmpresaFormBaseProps) {
  const empresas = useSelector(selectEmpresas);
  const router = useRouter();
  const [formData, setFormData] = useState<CategoriaEmpresaFormData>({
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
    <>
      <PageBreadcrumb
        pageTitle="Categorias de Empresas"
        pageBefore="Empresas"
      />
      <ComponentCard
        title={`${mode === 'create' ? 'Criar' : 'Editar'} Categoria de Empresa`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
            {/* Descrição */}
            <div>
              <Label>Categoria de Empresas</Label>
              <Input
                type="text"
                value={formData.descricao}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange('descricao', e.target.value)
                }
                placeholder="Informe um nome para categoria de empresas"
                disabled={disabled}
              />
            </div>
            <div>
              <EmpresaAutocomplete
                onSelect={(empresa) =>
                  handleChange('empresaId', empresa?.id || 0)
                }
                disabled={disabled}
                // resetSelection={mode === 'create'}
                onResetComplete={() => handleChange('empresaId', 0)}
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
            >
              Cancelar
            </Button>
            <Button disabled={disabled}>
              {mode === 'create'
                ? 'Criar Categroria de Empresa'
                : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
