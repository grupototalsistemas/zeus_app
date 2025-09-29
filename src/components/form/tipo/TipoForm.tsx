'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import Button from '@/components/ui/button/Button';
import { StatusRegistro } from '@/types/enum';
import { PessoaTipo } from '@/types/pessoaTipo.type';

import { usePessoaTipo } from '@/hooks/usePessoaTipo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Input from '../input/InputField';

interface TipoFormBaseProps {
  mode: 'create' | 'edit';
  id: string | undefined;
  disabled?: boolean;
}

export function TipoFormBase({
  mode,
  id,
  disabled = false,
}: TipoFormBaseProps) {
  const router = useRouter();
  const {
    fetchPessoaTipoById,
    pessoasTipos,
    createPessoaTipo,
    editPessoaTipo,
  } = usePessoaTipo();
  const [formData, setFormData] = useState<PessoaTipo>({
    empresaId: 0,
    descricao: '',
    ativo: StatusRegistro.ATIVO,
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchPessoaTipoById(Number(id)).then((response) => {
        console.log('Response fetchPessoaTipoById:', response);
        if (response) {
          const aux: PessoaTipo = {
            id: response.id,
            ativo: response.ativo,
            descricao: response.descricao,
            empresaId: response.empresaId,
          };
          setFormData(aux);
        }
      });
    }
  }, [mode, id]);

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
    // Lógica para criar um novo tipo
    createPessoaTipo(formData).then(() => {
      setFormData({ descricao: '', ativo: StatusRegistro.ATIVO, empresaId: 0 });
      router.replace('/gerenciar-tipo');
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para editar um tipo existente
    if (id) {
      editPessoaTipo(formData).then(() => {
        setFormData({
          descricao: '',
          ativo: StatusRegistro.ATIVO,
          empresaId: 0,
        });
        router.replace('/gerenciar-tipo');
      });
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      router.replace('/gerenciar-tipo');
    }
  };

  return (
    <ComponentCard title={`${mode === 'create' ? 'Criar' : 'Editar'} Função`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
          {/* Descrição */}
          <div>
            <Label>Descrição da Função</Label>
            <Input
              type="text"
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('descricao', e.target.value)
              }
              placeholder="Digite a descrição da função"
              disabled={disabled}
            />
          </div>
          <div>
            <EmpresaAutocomplete
              onSelect={(empresa) => handleChange('empresaId', empresa?.id)}
              empresaId={formData?.empresaId.toString()}
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
          <Button
            onClick={handleCancel}
            disabled={disabled}
            type="button"
            variant="outline"
          >
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
