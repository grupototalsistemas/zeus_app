'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import PessoaAutocomplete from '@/components/form/pessoa/PessoaAutocomplete';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { useEmpresaSistema } from '@/hooks/useEmpresaSistema';
import { selectOcorrenciasFormatadas } from '@/store/slices/ocorrenciaSlice';
import { selectPrioridadesFormatadas } from '@/store/slices/prioridadeSlice';
import { RootState } from '@/store/store';
import { Empresa } from '@/types/empresa.type';
import { StatusRegistro } from '@/types/enum';
import { Pessoa } from '@/types/pessoa.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import DropzoneComponent from '../form-elements/DropZone';

const ticketSchema = z.object({
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  sistemaId: z.string().min(1, 'Sistema é obrigatório'),
  pessoaId: z.string().min(1, 'Pessoa é obrigatória'),
  usuarioId: z.string().min(1, 'Usuário é obrigatório'),
  titulo: z.string().min(3, 'Título é obrigatório'),
  descricao: z.string().min(5, 'Descrição é obrigatória'),
  prioridadeId: z.string().min(1, 'Prioridade é obrigatória'),
  // opcionais / backend preenchidos

  ocorrenciaId: z.string().optional(),
  protocolo: z.string().optional(),
  observacao: z.string().optional(),
  ativo: z.enum(StatusRegistro),
  anexos: z.array(z.instanceof(File)).optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => void;
}

interface Option {
  value: number;
  label: string;
}

export function TicketFormBase({
  mode,
  initialData,
  onSubmit,
}: TicketFormBaseProps) {
  const ocorrencias = useSelector(selectOcorrenciasFormatadas);
  const prioridades = useSelector(selectPrioridadesFormatadas);
  const { getByEmpresaFormatados } = useEmpresaSistema();
  const [sistemas, setSistemas] = useState<Option[]>([]);
  const [anexosFiles, setAnexosFiles] = useState<File[]>([]);
  const { pessoaInfo } = useSelector((state: RootState) => state.pessoa);
  const [resetDropzone, setResetDropzone] = useState(false);
  const [resetPessoa, setResetPessoa] = useState(false);
  const [resetEmpresa, setResetEmpresa] = useState(false);
  // console.log('initial  data:', initialData);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      empresaId: initialData?.empresaId ?? '',
      sistemaId: initialData?.sistemaId ?? '',
      ocorrenciaId: initialData?.ocorrenciaId ?? '',
      titulo: initialData?.titulo ?? '',
      descricao: initialData?.descricao ?? '',
      prioridadeId: initialData?.prioridadeId ?? '',
      observacao: initialData?.observacao ?? '',
      pessoaId: initialData?.pessoaId ?? (pessoaInfo?.id || ''), // vem do redux
      usuarioId: initialData?.usuarioId ?? (pessoaInfo?.id || ''), // vem do redux
      ativo: initialData?.ativo ?? StatusRegistro.ATIVO,
      protocolo: initialData?.protocolo ?? Date.now().toString(),
    },
  });

  useEffect(() => {
    console.log('empresaId: ');
    const empresaId = watch('empresaId');
    if (empresaId) {
      pegarSitemas(empresaId);
    }
  }, [watch('empresaId')]);

  const pegarSitemas = async (id_empresa: string) => {
    const sistemas = await getByEmpresaFormatados(id_empresa);
    console.log('sistemas: ', sistemas);
    setSistemas(sistemas);
  };

  // Atualiza valores no modo edit
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined)
          setValue(key as keyof TicketFormData, value as any);
      });
    }
  }, [initialData, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAnexosFiles(files);
      setValue('anexos', files);
    }
  };

  const scrollToError = (errorKey: string) => {
    const selectors = [
      `[name="${errorKey}"]`,
      `#${errorKey}`,
      `[data-field="${errorKey}"]`,
      `[aria-label*="${errorKey}"]`,
      `.error-${errorKey}`,
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (element instanceof HTMLElement) {
          element.focus();
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      scrollToError(firstErrorKey);
    }
  }, [errors]);

  const handleFormSubmit = async (data: TicketFormData) => {
    const formDataWithFiles = {
      ...data,
      anexos: anexosFiles,
    };

    try {
      await onSubmit(formDataWithFiles);

      // Só limpa os campos se for modo CREATE e não houve erro
      if (mode === 'create') {
        // Resetar o formulário
        reset(
          {
            empresaId: '',
            sistemaId: '',
            ocorrenciaId: '',
            titulo: '',
            descricao: '',
            prioridadeId: '',
            observacao: '',
            pessoaId: pessoaInfo?.id || '',
            usuarioId: pessoaInfo?.id || '',
            ativo: StatusRegistro.ATIVO,
            protocolo: Date.now().toString(),
          },
          { keepValues: false }
        );

        // Resetar valores específicos
        setValue('empresaId', '');
        setValue('sistemaId', '');
        setValue('pessoaId', '');
        setValue('ocorrenciaId', '');
        setValue('titulo', '');
        setValue('descricao', '');
        setValue('prioridadeId', '');
        setValue('observacao', '');

        // Limpar anexos
        setAnexosFiles([]);

        // Resetar componentes autocomplete
        setResetDropzone(true);
        setResetPessoa(true);
        setResetEmpresa(true);

        // Limpar lista de sistemas
        setSistemas([]);
      }
    } catch (error) {
      // O erro será tratado no componente pai (CreateTicketPage)
      throw error; // Relança o erro para ser capturado pelo componente pai
    }
  };

  const handleDropzoneResetComplete = () => {
    setResetDropzone(false);
  };
  const handlePessoaResetComplete = () => {
    setResetPessoa(false);
  };
  const handleEmpresaResetComplete = () => {
    setResetEmpresa(false);
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle={mode === 'create' ? 'Criar Chamado' : 'Editar Chamado'}
        pageBefore="Chamados"
      />
      <ComponentCard
        title={mode === 'create' ? 'Novo Chamado' : 'Editar Chamado'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Identificação */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <EmpresaAutocomplete
                onSelect={(empresa: Empresa | null) => {
                  if (empresa) {
                    setValue('empresaId', empresa.id?.toString() || '');
                    trigger('empresaId');
                  } else {
                    setValue('empresaId', '');
                  }
                }}
                disabled={isSubmitting}
                resetSelection={resetEmpresa}
                onResetComplete={handleEmpresaResetComplete}
              />
              {errors.empresaId && (
                <p className="text-sm text-red-500">
                  {errors.empresaId.message}
                </p>
              )}
            </div>
            <div>
              <Label>Sistema *</Label>
              <Select
                options={sistemas}
                placeholder="Selecione o Sistema"
                onChange={(opt: any) => {
                  setValue('sistemaId', opt);
                  trigger('sistemaId');
                }}
                value={watch('sistemaId')}
                disabled={isSubmitting || !!watch('empresaId') === false}
              />
              {errors.sistemaId && (
                <p className="text-sm text-red-500">
                  {errors.sistemaId?.message}
                </p>
              )}
            </div>
          </div>

          {/* Identificação da Pessoa */}
          <div className="grid grid-cols-1 gap-4">
            <PessoaAutocomplete
              onSelect={(pessoa: Pessoa | null) => {
                if (pessoa) {
                  setValue('pessoaId', pessoa.id?.toString() || '');
                  trigger('pessoaId');
                } else {
                  setValue('pessoaId', '');
                }
              }}
              empresaId={watch('empresaId')}
              disabled={isSubmitting || !!watch('empresaId') === false}
              resetSelection={resetPessoa}
              onResetComplete={handlePessoaResetComplete}
            />
            {errors.pessoaId && (
              <p className="text-sm text-red-500">{errors.pessoaId.message}</p>
            )}
          </div>

          {/* Detalhes */}
          <div>
            <Label>Título *</Label>
            <Input
              type="text"
              placeholder="Informe um título"
              value={watch('titulo')}
              onChange={(e) => setValue('titulo', e.target.value)}
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <Label>Descrição *</Label>
            <TextArea
              value={watch('descricao')}
              placeholder="Descreva o chamado"
              onChange={(value) => setValue('descricao', value)}
              rows={5}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Ocorrência</Label>
              <Select
                options={ocorrencias}
                placeholder="Selecione a Ocorrência"
                onChange={(opt: any) => setValue('ocorrenciaId', opt)}
                value={watch('ocorrenciaId')}
              />
            </div>
            <div>
              <Label>Prioridade *</Label>
              <Select
                options={prioridades}
                placeholder="Selecione a Prioridade"
                onChange={(opt: any) => {
                  setValue('prioridadeId', opt);
                  trigger('prioridadeId');
                }}
                value={watch('prioridadeId')}
              />
              {errors.prioridadeId && (
                <p className="text-sm text-red-500">
                  {errors.prioridadeId.message}
                </p>
              )}
            </div>
          </div>

          {/* Extras */}
          <DropzoneComponent
            onFilesChange={(files) => {
              handleFileChange({ target: { files } } as any);
            }}
            resetFiles={resetDropzone}
            onResetComplete={handleDropzoneResetComplete}
          />

          <div>
            <Label>Observação (opcional)</Label>
            <Input
              type="text"
              placeholder="Alguma mensagem adicional?"
              value={watch('observacao')}
              onChange={(e) => setValue('observacao', e.target.value)}
            />
          </div>

          {/* Campos automáticos / ocultos */}
          <input type="hidden" {...register('pessoaId')} />
          <input type="hidden" {...register('usuarioId')} />

          <input type="hidden" {...register('protocolo')} />

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? mode === 'create'
                  ? 'Salvando...'
                  : 'Atualizando...'
                : mode === 'create'
                  ? 'Salvar Chamado'
                  : 'Atualizar Chamado'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
