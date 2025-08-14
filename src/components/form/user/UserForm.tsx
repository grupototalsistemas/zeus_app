'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { AuthService } from '@/service/auth.service';
import { EmpresaService } from '@/service/empresa.service';
import { StatusGenero } from '@/types/enum';
import { PessoaUsuarioDTO } from '@/types/pessoaUsuario.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Checkbox from '../input/Checkbox';

const options_pessoas = [
  { value: 0, label: 'Usuario' },
  { value: 1, label: 'Escrevente' },
  { value: 2, label: 'Notificador' },
  { value: 3, label: 'Tabeliao' },
];

interface EmpresasSelect {
  value: number;
  label: string;
}

const userSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  empresa: z.string().min(1, 'Empresa é obrigatória'),
  acesso: z.enum(['admin', 'usuario', 'suporte']),
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
  const [showPassword, setShowPassword] = useState(false);
    const [empresas, setEmpresas] = useState<EmpresasSelect[]>([]);
    const [empresa, setEmpresa] = useState(0);
    const [formData, setFormData] = useState<PessoaUsuarioDTO>({
      login: '',
      email: '',
      pessoa: {
        id_empresa: empresa,
        id_pessoa_tipo: 1,
        genero: StatusGenero.MASCULINO,
        nome: '',
        nome_social: '',
      },
      perfil: {
        id_empresa: empresa,
        descricao: 'MASTER',
      },
      senha: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
  
    const handleChange = (path: string, value: any) => {
      setFormData((prev) => {
        const keys = path.split('.');
        const updated = { ...prev };
  
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = { ...obj[keys[i]] };
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
  
        return updated;
      });
    };
  
    const handleRegister = async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      setLoading(true);
  
      if (
        !formData.pessoa.nome ||
        !formData.login ||
        !formData.senha ||
        !formData.email
      ) {
        setError('Preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }
  
      try {
        console.log(formData);
        await AuthService.register(formData);
        router.push('/signin');
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || 'Erro inesperado.'
        );
      } finally {
        setLoading(false);
      }
    };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    values: {
      nome: initialData?.nome ?? '',
      email: initialData?.email ?? '',
      senha: initialData?.senha ?? '',
      empresa: initialData?.empresa ?? '',
      acesso: initialData?.acesso ?? 'usuario',
    },
  });

  const acessoOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'usuario', label: 'Usuário' },
    { value: 'suporte', label: 'Suporte' },
  ];

  useEffect(() => {
      const fetch = async () => {
        try {
          let aux: EmpresasSelect[] = [];
          const response = await EmpresaService.getEmpresas();
          response.forEach((empresa) => {
            aux.push({ value: empresa.id || 0, label: empresa.nomeFantasia });
          });
          console.log(aux);
          setEmpresas(aux);
        } catch (err: any) {
          console.error(err);
        }
      };
      fetch();
    }, [error]);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value) setValue(key as keyof UserFormData, value as any);
      });
    }
  }, [initialData, setValue]);

  return (
    <>
      <PageBreadcrumb
        pageTitle={mode === 'create' ? 'Criar Usuário' : 'Editar Usuário'}
        pageBefore="Usuários"
      />
      <ComponentCard
        title={mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
      >
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>
                Nome<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="Informe seu nome"
                value={formData.pessoa.nome}
                onChange={(e) => handleChange('pessoa.nome', e.target.value)}
              />
            </div>
            <div>
              <Label>Nome Social</Label>
              <Input
                type="text"
                placeholder="(Opcional)"
                value={formData.pessoa.nome_social}
                onChange={(e) =>
                  handleChange('pessoa.nome_social', e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <Label>
              Login<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Crie um login"
              value={formData.login}
              onChange={(e) => handleChange('login', e.target.value)}
            />
          </div>

          <div>
            <Label>
              Email<span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <Label>Empresa</Label>
            <div className="relative">
              <Select
                options={empresas}
                placeholder="Selecione a empresa"
                onChange={(opt: string) => {handleChange('pessoa.id_empresa', Number(opt));handleChange('perfil.id_empresa', Number(opt))} }
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <Label>O que você é dessa empresa</Label>
            <div className="relative">
              <Select
                options={options_pessoas}
                placeholder="Selecione"
                onChange={(opt: any) => {
                  console.log('tipo pessoa: ', opt);
                  handleChange('pessoa.id_pessoa_tipo', Number(opt));
                }}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formData.pessoa.genero === StatusGenero.MASCULINO}
                onChange={() =>
                  handleChange('pessoa.genero', StatusGenero.MASCULINO)
                }
              />
              <span>Masculino</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={formData.pessoa.genero === StatusGenero.FEMININO}
                onChange={() =>
                  handleChange('pessoa.genero', StatusGenero.FEMININO)
                }
              />
              <span>Feminino</span>
            </label>
          </div>

          <div>
            <Label>
              Senha<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Crie uma senha"
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
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
            disabled={loading}
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </ComponentCard>
    </>
  );
}
