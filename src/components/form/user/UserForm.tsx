'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    values: initialData,
  });

  const acessoOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'usuario', label: 'Usuário' },
    { value: 'suporte', label: 'Suporte' },
  ];

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Informe o nome"
              value={initialData?.nome}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Informe o email"
              value={initialData?.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Informe a senha"
              value={initialData?.senha}
            />
            {errors.senha && (
              <p className="text-sm text-red-500">{errors.senha.message}</p>
            )}
          </div>

          <div>
            <Label>Empresa</Label>
            <Input
              type="text"
              placeholder="Informe a empresa"
              value={initialData?.empresa}
            />
            {errors.empresa && (
              <p className="text-sm text-red-500">{errors.empresa.message}</p>
            )}
          </div>

          <div>
            <Label>Acesso</Label>
            <div className="relative">
              <Select
                options={acessoOptions}
                placeholder="Selecione o acesso"
                onChange={(opt: any) => setValue('acesso', opt.value)}
                value={initialData?.acesso}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.acesso && (
              <p className="text-sm text-red-500">{errors.acesso.message}</p>
            )}
          </div>

          <div className="text-right">
            <Button size="md" variant="primary">
              {mode === 'create' ? 'Salvar Usuário' : 'Atualizar Usuário'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
