'use client';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { AuthService } from '@/service/auth.service';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Pode vir da rota ou de token de redefinição
  const userId = searchParams.get('id');

  // Função para verificar força da senha
  const getPasswordStrength = (senha: string) => {
    const hasLetters = /[A-Za-z]/.test(senha);
    const hasNumbers = /\d/.test(senha);
    const hasMinLength = senha.length >= 6;

    if (!hasMinLength) return { label: 'Muito curta', color: 'text-red-500' };
    if (hasLetters && hasNumbers && senha.length >= 8) {
      return { label: 'Forte', color: 'text-green-500' };
    }
    if (hasLetters && hasNumbers) {
      return { label: 'Média', color: 'text-yellow-500' };
    }
    return { label: 'Fraca', color: 'text-red-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (strength.label === 'Muito curta' || strength.label === 'Fraca') {
      setError(
        'A senha deve conter números, letras e pelo menos 6 caracteres.'
      );
      return;
    }

    setLoading(true);
    try {
      if (userId) {
        // Fluxo para reset de senha via link (usuário esqueceu a senha)
        await AuthService.resetPassword('ndf');
      } else {
        // Fluxo para troca voluntária (usuário logado)
        await AuthService.changePassword({ password });
      }
      alert('Senha trocada com sucesso!');
      router.push('/signin');
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Erro inesperado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto px-4 sm:px-6 lg:w-1/2">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            {userId ? 'Redefinir Senha' : 'Alterar Senha'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userId
              ? 'Crie uma nova senha para acessar sua conta.'
              : 'Digite sua nova senha para atualizar.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>
              Nova Senha<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Digite a nova senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
            {password && (
              <p className={`mt-1 text-xs ${strength.color}`}>
                Força da senha: {strength.label}
              </p>
            )}
          </div>

          <div>
            <Label>
              Confirmar Nova Senha<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Confirme a nova senha"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 cursor-pointer"
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
        <div className="mt-5">
          <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
            Retornar a tela de login?{' '}
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Voltar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
