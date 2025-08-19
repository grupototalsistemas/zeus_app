'use client';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { useAppDispatch } from '@/hooks/useRedux';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { AuthService } from '@/service/auth.service';
import { RootState } from '@/store/rootReducer';
import { Empresa } from '@/types/empresa.type';
import { StatusGenero } from '@/types/enum';
import { PessoaUsuarioRegisterDTO } from '@/types/pessoaUsuario.type';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from '../form/input/Checkbox';
import Select from '../form/Select';

const options_pessoas = [
  { value: 0, label: 'Usuario' },
  { value: 1, label: 'Escrevente' },
  { value: 2, label: 'Notificador' },
  { value: 3, label: 'Tabeliao' },
];

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const { empresas } = useSelector((state: RootState) => state.empresa);
  const [showPassword, setShowPassword] = useState(false);
  const [empresa, setEmpresa] = useState(0);
  const [empresasFormatadas, setEmpresasFormatadas] = useState([
    { value: 0, label: 'Selecione uma empresa' },
  ]);
  const [formData, setFormData] = useState<PessoaUsuarioRegisterDTO>({
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

  const formataEmpresa = (empresas: Empresa[]) => {
    const empresasFormatadas = empresas.map((empresa) => ({
      value: empresa.id || 0,
      label: empresa.nomeFantasia,
    }));
    setEmpresasFormatadas(empresasFormatadas);
  };

  useEffect(() => {
    if (empresas && empresas.length > 0) {
      console.log('empresas: ', empresas);
      formataEmpresa(empresas);
    }
  }, [empresas]);

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto px-4 sm:px-6 lg:w-1/2">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Cadastrar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Utilize seus dados para criar uma conta.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

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
                options={empresasFormatadas}
                placeholder="Selecione a empresa"
                onChange={(opt: string) => {
                  handleChange('pessoa.id_empresa', Number(opt));
                  handleChange('perfil.id_empresa', Number(opt));
                }}
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

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Já tem conta?{' '}
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
