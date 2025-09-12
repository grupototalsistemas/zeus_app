'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { EmpresaService } from '@/service/empresa.service';
import { selectPerfisFormatados } from '@/store/slices/perfilSlice';
import { selectPessoasTiposFormatados } from '@/store/slices/pessoaTipoSlice';
import { Empresa } from '@/types/empresa.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import Checkbox from '../input/Checkbox';

interface EmpresasSelect {
  value: number;
  label: string;
}

const pessoaSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  nomeSocial: z.string().optional(),
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  tipoId: z.string().min(1, 'Função é obrigatória'),
  genero: z.enum(['MASCULINO', 'FEMININO']),
});

export type PessoaFormData = z.infer<typeof pessoaSchema>;

interface PessoaFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PessoaFormData>;
  onSubmit: (data: PessoaFormData) => void;
}

export function PessoaFormBase({
  mode,
  initialData,
  onSubmit,
}: PessoaFormBaseProps) {
  const perfis = useSelector(selectPerfisFormatados);
  const tipos = useSelector(selectPessoasTiposFormatados);

  const [showPassword, setShowPassword] = useState(false);
  const [empresas, setEmpresas] = useState<EmpresasSelect[]>([]);

  // RHF só para validação
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: {
      nome: initialData?.nome ?? '',
      nomeSocial: initialData?.nomeSocial ?? '',
      empresaId: initialData?.empresaId ?? '',
      tipoId: initialData?.tipoId ?? '',
      genero: initialData?.genero ?? 'MASCULINO',
    },
  });

  // sincroniza valores com Input manual
  const formValues = watch();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await EmpresaService.getEmpresas();
        const aux = response.map((empresa: any) => ({
          value: empresa.id || 0,
          label: empresa.nomeFantasia,
        }));
        setEmpresas(aux);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <PageBreadcrumb
        pageTitle={mode === 'create' ? 'Criar Pessoa' : 'Editar Pessoa'}
        pageBefore="Pessoa"
      />
      <ComponentCard
        title={mode === 'create' ? 'Nova Pessoa' : 'Editar Pessoa'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Nome*</Label>
              <Input
                type="text"
                placeholder="Informe seu nome"
                value={formValues.nome}
                onChange={(e) =>
                  setValue('nome', e.target.value, { shouldValidate: true })
                }
                error={!!errors.nome}
                hint={errors.nome?.message}
              />
            </div>
            <div>
              <Label>Nome Social</Label>
              <Input
                type="text"
                placeholder="(Opcional)"
                value={formValues.nomeSocial}
                onChange={(e) => setValue('nomeSocial', e.target.value)}
              />
            </div>
          </div>

          <div>
            <EmpresaAutocomplete
              // resetSelection={mode === 'edit'}
              onResetComplete={() =>
                setValue('empresaId', '', { shouldValidate: true })
              }
              onSelect={(empresa: Empresa | null) => {
                if (empresa) {
                  setValue('empresaId', String(empresa.id), {
                    shouldValidate: true,
                  });
                }
              }}
            />

            {errors.empresaId && (
              <p className="text-error-500 text-sm">
                {errors.empresaId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Função*</Label>
            <div className="relative">
              <Select
                options={tipos}
                placeholder="Selecione"
                onChange={(opt: any) =>
                  setValue('tipoId', String(opt), { shouldValidate: true })
                }
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formValues.genero === 'MASCULINO'}
                onChange={() => setValue('genero', 'MASCULINO')}
              />
              <span>Masculino</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formValues.genero === 'FEMININO'}
                onChange={() => setValue('genero', 'FEMININO')}
              />
              <span>Feminino</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancelar</Button>
            <Button>
              {mode === 'create' ? 'Criar Pessoa' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
