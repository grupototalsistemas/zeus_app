'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { EmpresaService } from '@/service/empresa.service';
import { selectPerfisFormatados } from '@/store/slices/perfilSlice';
import { selectPessoasTiposFormatados } from '@/store/slices/pessoaTipoSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import Checkbox from '../input/Checkbox';

interface EmpresasSelect {
  value: number;
  label: string;
}

const pessoaSchema = z.object({
  login: z.string().min(3, 'Login é obrigatório'),
  nome: z.string().min(3, 'Nome é obrigatório'),
  nome_social: z.string().optional(),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  empresa: z.string().min(1, 'Empresa é obrigatória'),
  funcao: z.string().min(1, 'Função é obrigatória'),
  perfil: z.string().min(1, 'Perfil é obrigatório'),
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
      login: initialData?.login ?? '',
      nome: initialData?.nome ?? '',
      nome_social: initialData?.nome_social ?? '',
      email: initialData?.email ?? '',
      senha: initialData?.senha ?? '',
      empresa: initialData?.empresa ?? '',
      funcao: initialData?.funcao ?? '',
      perfil: initialData?.perfil ?? '',
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
                value={formValues.nome_social}
                onChange={(e) => setValue('nome_social', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Login*</Label>
            <Input
              type="text"
              placeholder="Crie um login"
              value={formValues.login}
              onChange={(e) =>
                setValue('login', e.target.value, { shouldValidate: true })
              }
              error={!!errors.login}
              hint={errors.login?.message}
            />
          </div>

          <div>
            <Label>Email*</Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={formValues.email}
              onChange={(e) =>
                setValue('email', e.target.value, { shouldValidate: true })
              }
              error={!!errors.email}
              hint={errors.email?.message}
            />
          </div>

          <div>
            <Label>Empresa*</Label>
            <div className="relative">
              <Select
                options={empresas}
                placeholder="Selecione a empresa"
                onChange={(opt: any) =>
                  setValue('empresa', String(opt), { shouldValidate: true })
                }
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.empresa && (
              <p className="text-error-500 text-sm">{errors.empresa.message}</p>
            )}
          </div>

          <div>
            <Label>Função*</Label>
            <div className="relative">
              <Select
                options={tipos}
                placeholder="Selecione"
                onChange={(opt: any) =>
                  setValue('funcao', String(opt), { shouldValidate: true })
                }
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <Label>Perfil*</Label>
            <div className="relative">
              <Select
                options={perfis}
                placeholder="Selecione"
                onChange={(opt: any) =>
                  setValue('perfil', String(opt), { shouldValidate: true })
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

          <div>
            <Label>Senha*</Label>
            <div className="relative">
              <Input
                placeholder="Crie uma senha"
                type={showPassword ? 'text' : 'password'}
                value={formValues.senha}
                onChange={(e) =>
                  setValue('senha', e.target.value, { shouldValidate: true })
                }
                error={!!errors.senha}
                hint={errors.senha?.message}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {mode === 'create' ? 'Cadastrar' : 'Salvar alterações'}
          </button>
        </form>
      </ComponentCard>
    </>
  );
}
