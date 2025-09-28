'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { useEmpresaCategoria } from '@/hooks/useEmpresaCategoria';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import { StatusRegistro } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

interface CategoriaEmpresaFormBaseProps {
  mode: 'create' | 'edit';
  id: String | undefined;
  disabled?: boolean;
}

export function CategoriaEmpresaFormBase({
  mode,
  id,
  disabled = false,
}: CategoriaEmpresaFormBaseProps) {
  const [resetSelection, setResetSelection] = useState(false);
  const { getById, create, update } = useEmpresaCategoria();
  const router = useRouter();
  const [formData, setFormData] = useState<EmpresaCategoria>({
    empresaId: 0,
    descricao: '',
    ativo: StatusRegistro.ATIVO,
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      getById(Number(id)).then((response) => {
        if (response.payload) {
          setFormData(response.payload);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      await create(formData).then(() => {
        setResetSelection(true);
        handleCancel();
      });
    }
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      const { id: id_formdata, createdAt, updatedAt, ...rest } = formData;
      await update(Number(id) || 0, rest).then(
        (response) => response && handleCancel()
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'create') {
      handleCreate(e);
    } else {
      handleUpdate(e);
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      setFormData({
        empresaId: 0,
        descricao: '',
        ativo: StatusRegistro.ATIVO,
      });
      setResetSelection(false);
      router.replace('/gerenciar-categoria');
    }
  };

  return (
    <>
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
                empresaId={formData.empresaId.toString()}
                resetSelection={resetSelection}
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
