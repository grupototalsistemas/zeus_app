'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { EmpresaService } from '@/service/empresa.service';
import { selectCategoriasFormatadas } from '@/store/slices/empresaCategoriaSlice';

import { selectTiposFormatados } from '@/store/slices/empresaTipoSlice';
import { StatusSiglaEstado } from '@/types/enum';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import TextArea from '../input/TextArea';

interface EmpresasSelect {
  value: number;
  label: string;
}

interface TiposSelect {
  value: number;
  label: string;
}

interface CategoriasSelect {
  value: number;
  label: string;
}

const empresaSchema = z.object({
  parentId: z.string().min(1, 'Empresa pai é obrigatória'),
  tipoId: z.string().min(1, 'Tipo é obrigatório'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(18, 'CNPJ inválido'),
  codigo: z.string().optional(),
  razaoSocial: z.string().min(3, 'Razão social é obrigatória'),
  nomeFantasia: z.string().min(3, 'Nome fantasia é obrigatório'),
  logradouro: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.nativeEnum(StatusSiglaEstado).optional(),
  cep: z.string().optional(),
  contato: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  observacao: z.string().optional(),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;

interface EmpresaFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<EmpresaFormData>;
  onSubmit: (data: EmpresaFormData) => void;
}

const estadosOptions = Object.values(StatusSiglaEstado).map((estado) => ({
  value: estado,
  label: estado,
}));

export function EmpresaFormBase({
  mode,
  initialData,
  onSubmit,
}: EmpresaFormBaseProps) {
  const tipos = useSelector(selectTiposFormatados);
  const categorias = useSelector(selectCategoriasFormatadas);

  const [empresasPai, setEmpresasPai] = useState<EmpresasSelect[]>([]);

  // RHF só para validação
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      parentId: initialData?.parentId ?? '',
      tipoId: initialData?.tipoId ?? '',
      categoriaId: initialData?.categoriaId ?? '',
      cnpj: initialData?.cnpj ?? '',
      codigo: initialData?.codigo ?? '',
      razaoSocial: initialData?.razaoSocial ?? '',
      nomeFantasia: initialData?.nomeFantasia ?? '',
      logradouro: initialData?.logradouro ?? '',
      endereco: initialData?.endereco ?? '',
      numero: initialData?.numero ?? '',
      complemento: initialData?.complemento ?? '',
      bairro: initialData?.bairro ?? '',
      cidade: initialData?.cidade ?? '',
      estado: initialData?.estado ?? undefined,
      cep: initialData?.cep ?? '',
      contato: initialData?.contato ?? '',
      email: initialData?.email ?? '',
      observacao: initialData?.observacao ?? '',
    },
  });

  // sincroniza valores com Input manual
  const formValues = watch();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await EmpresaService.getEmpresas();
        const aux = response.map((empresa: any) => ({
          value: empresa.id || 0,
          label: empresa.nomeFantasia,
        }));
        setEmpresasPai(aux);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchEmpresas();
  }, []);

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
    return cleaned;
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{3})$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return cleaned;
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle={mode === 'create' ? 'Criar Empresa' : 'Editar Empresa'}
        pageBefore="Empresas"
      />
      <ComponentCard
        title={mode === 'create' ? 'Nova Empresa' : 'Editar Empresa'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Informações Básicas */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Empresa Pai*</Label>
              <div className="relative">
                <Select
                  options={empresasPai}
                  placeholder="Selecione a empresa pai"
                  onChange={(opt: any) =>
                    setValue('parentId', String(opt), { shouldValidate: true })
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.parentId && (
                <p className="text-error-500 text-sm">
                  {errors.parentId.message}
                </p>
              )}
            </div>
            <div>
              <Label>Tipo*</Label>
              <div className="relative">
                <Select
                  options={tipos}
                  placeholder="Selecione o tipo"
                  onChange={(opt: any) =>
                    setValue('tipoId', String(opt), { shouldValidate: true })
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.tipoId && (
                <p className="text-error-500 text-sm">
                  {errors.tipoId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Categoria*</Label>
              <div className="relative">
                <Select
                  options={categorias}
                  placeholder="Selecione a categoria"
                  onChange={(opt: any) =>
                    setValue('categoriaId', String(opt), {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.categoriaId && (
                <p className="text-error-500 text-sm">
                  {errors.categoriaId.message}
                </p>
              )}
            </div>
            <div>
              <Label>Código</Label>
              <Input
                type="text"
                placeholder="Código da empresa"
                value={formValues.codigo}
                onChange={(e) => setValue('codigo', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>CNPJ*</Label>
            <Input
              type="text"
              placeholder="00.000.000/0000-00"
              value={formValues.cnpj}
              onChange={(e) => {
                const formatted = formatCNPJ(e.target.value);
                setValue('cnpj', formatted, { shouldValidate: true });
              }}
              error={!!errors.cnpj}
              hint={errors.cnpj?.message}
              max="18"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Razão Social*</Label>
              <Input
                type="text"
                placeholder="Razão social da empresa"
                value={formValues.razaoSocial}
                onChange={(e) =>
                  setValue('razaoSocial', e.target.value, {
                    shouldValidate: true,
                  })
                }
                error={!!errors.razaoSocial}
                hint={errors.razaoSocial?.message}
              />
            </div>
            <div>
              <Label>Nome Fantasia*</Label>
              <Input
                type="text"
                placeholder="Nome fantasia da empresa"
                value={formValues.nomeFantasia}
                onChange={(e) =>
                  setValue('nomeFantasia', e.target.value, {
                    shouldValidate: true,
                  })
                }
                error={!!errors.nomeFantasia}
                hint={errors.nomeFantasia?.message}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="pt-5">
            <h3 className="mb-4 text-lg font-medium dark:text-white/90">
              Endereço
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Logradouro</Label>
                <Input
                  type="text"
                  placeholder="Rua, Avenida, etc."
                  value={formValues.logradouro}
                  onChange={(e) => setValue('logradouro', e.target.value)}
                />
              </div>
              <div>
                <Label>Endereço</Label>
                <Input
                  type="text"
                  placeholder="Nome da rua/avenida"
                  value={formValues.endereco}
                  onChange={(e) => setValue('endereco', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label>Número</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={formValues.numero}
                  onChange={(e) => setValue('numero', e.target.value)}
                />
              </div>
              <div>
                <Label>Complemento</Label>
                <Input
                  type="text"
                  placeholder="Apto, Sala, etc."
                  value={formValues.complemento}
                  onChange={(e) => setValue('complemento', e.target.value)}
                />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input
                  type="text"
                  placeholder="Nome do bairro"
                  value={formValues.bairro}
                  onChange={(e) => setValue('bairro', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  placeholder="Nome da cidade"
                  value={formValues.cidade}
                  onChange={(e) => setValue('cidade', e.target.value)}
                />
              </div>
              <div>
                <Label>Estado</Label>
                <div className="relative">
                  <Select
                    options={estadosOptions}
                    placeholder="Selecione o estado"
                    onChange={(opt: any) => setValue('estado', opt)}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>CEP</Label>
                <Input
                  type="text"
                  placeholder="00000-000"
                  value={formValues.cep}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value);
                    setValue('cep', formatted);
                  }}
                  max="9"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="pt-5">
            <h3 className="mb-4 text-lg font-medium dark:text-white/90">
              Contato
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Contato</Label>
                <Input
                  type="text"
                  placeholder="Telefone, WhatsApp, etc."
                  value={formValues.contato}
                  onChange={(e) => setValue('contato', e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formValues.email}
                  onChange={(e) =>
                    setValue('email', e.target.value, { shouldValidate: true })
                  }
                  error={!!errors.email}
                  hint={errors.email?.message}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <TextArea
              placeholder="Observações adicionais..."
              value={formValues.observacao}
              onChange={(value) => setValue('observacao', value)}
            />
            {/* <textarea
              placeholder="Observações adicionais..."
              value={formValues.observacao}
              onChange={(e) => setValue('observacao', e.target.value)}
              rows={4}
              className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none"
            /> */}
          </div>

          <button
            type="submit"
            className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {mode === 'create' ? 'Cadastrar Empresa' : 'Salvar alterações'}
          </button>
        </form>
      </ComponentCard>
    </>
  );
}
