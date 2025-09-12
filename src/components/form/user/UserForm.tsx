'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { EmpresaService } from '@/service/empresa.service';
import { selectPerfisFormatados } from '@/store/slices/perfilSlice';
import { selectPessoasTiposFormatados } from '@/store/slices/pessoaTipoSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import PessoaAutocomplete from '../pessoa/PessoaAutocomplete';

interface EmpresasSelect {
  value: number;
  label: string;
}

const userSchema = z.object({
  login: z.string().min(3, 'Login é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  pessoaId: z.string().min(1, 'Pessoa é obrigatória'),
  perfilId: z.string().min(1, 'Perfil é obrigatório'),
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
}

export function UserFormBase({
  mode,
  initialData,
  onSubmit,
}: UserFormBaseProps) {
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
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      login: initialData?.login ?? '',
      empresaId: initialData?.empresaId ?? '',
      email: initialData?.email ?? '',
      senha: initialData?.senha ?? '',
      pessoaId: initialData?.pessoaId ?? '',
      perfilId: initialData?.perfilId ?? '',
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
        pageTitle={mode === 'create' ? 'Criar Usuário' : 'Editar Usuário'}
        pageBefore="Usuários"
      />
      <ComponentCard
        title={mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <EmpresaAutocomplete
                onResetComplete={() => setValue('empresaId', '')}
                onSelect={(empresa) => {
                  setValue('empresaId', String(empresa?.id));
                }}
              />
            </div>
            <div>
              <PessoaAutocomplete
                onResetComplete={() => setValue('pessoaId', '')}
                onSelect={(pessoa) => {
                  setValue('pessoaId', String(pessoa?.id));
                }}
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
            <Label>Perfil*</Label>
            <div className="relative">
              <Select
                options={perfis}
                placeholder="Selecione"
                onChange={(opt: any) =>
                  setValue('perfilId', String(opt), { shouldValidate: true })
                }
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
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

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancelar</Button>
            <Button>
              {mode === 'create' ? 'Criar Usuario' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
