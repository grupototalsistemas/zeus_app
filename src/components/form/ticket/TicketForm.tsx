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
import { useOcorrencia } from '@/hooks/useOcorrencia';
import { useOcorrenciaTipo } from '@/hooks/useOcorrenciaTipo';
import {
  selectOcorrencias,
  selectOcorrenciasFormatadas,
} from '@/store/slices/ocorrenciaSlice';
import { selectOcorrenciaTiposFormatadas } from '@/store/slices/ocorrenciaTipoSlice';
import { selectPrioridadesFormatadas } from '@/store/slices/prioridadeSlice';
import { RootState } from '@/store/store';
import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';
import { Empresa } from '@/types/empresa.type';
import { StatusRegistro } from '@/types/enum';
import { PessoasFisica } from '@/types/pessoasFisica.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import EmpresaAutocomplete from '../empresa/EmpresaAutoComplete';
import DropzoneComponent from '../form-elements/DropZone';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const ticketSchema = z.object({
  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  sistemaId: z.string().min(1, 'Sistema é obrigatório'),
  pessoaId: z.string().min(1, 'Pessoa é obrigatória'),
  usuarioId: z.string().min(1, 'Usuário é obrigatório'),
  titulo: z.string().min(3, 'Título é obrigatório'),
  descricao: z.string().min(5, 'Descrição é obrigatória'),
  prioridadeId: z.string().min(1, 'Prioridade é obrigatória'),
  ocorrenciaId: z.string().min(1, 'Ocorrência é obrigatória'),
  // opcionais / backend preenchidos
  protocolo: z.string().optional(),
  observacao: z.string().optional(),
  descricaoAnexo: z.string().optional(),
  ativo: z.nativeEnum(StatusRegistro),
  arquivo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Arquivo não pode ser maior que 30MB`
    )
    .refine(
      (file) => ALLOWED_FILE_TYPES.includes(file.type),
      'Apenas PNG, JPG, WebP, SVG ou PDF são permitidos'
    )
    .optional()
    .or(z.undefined()),
  anexos: z.array(z.instanceof(File)).optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => void;
  existingAttachments?: ChamadoMovimentoAnexo[];
  initialEmpresaNome?: string;
  initialPessoaNome?: string;
}

interface Option {
  value: string | number;
  label: string;
}

export function TicketFormBase({
  mode,
  initialData,
  existingAttachments = [],
  initialEmpresaNome,
  initialPessoaNome,
  onSubmit,
}: TicketFormBaseProps) {
  const ocorrenciasCompleta = useSelector(selectOcorrencias);
  const ocorrencias = useSelector(selectOcorrenciasFormatadas);
  const tiposOcorrencia = useSelector(selectOcorrenciaTiposFormatadas);
  const prioridades = useSelector(selectPrioridadesFormatadas);
  const { getByEmpresaFormatados } = useEmpresaSistema();
  const { fetchOcorrencias } = useOcorrencia();
  const { buscarOcorrenciasTipos } = useOcorrenciaTipo();
  const [sistemas, setSistemas] = useState<Option[]>([]);
  const [sistemasDefinidosPelaEmpresa, setSistemasDefinidosPelaEmpresa] =
    useState(false);
  const [anexosFiles, setAnexosFiles] = useState<File[]>([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null
  );
  const [tipoOcorrenciaId, setTipoOcorrenciaId] = useState<string>('');
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
    getValues,
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
      pessoaId: initialData?.pessoaId ?? (pessoaInfo?.id_pessoa_fisica || ''), // vem do redux
      usuarioId:
        initialData?.usuarioId ?? (pessoaInfo?.id_pessoa_usuario || ''), // vem do redux
      ativo: initialData?.ativo ?? StatusRegistro.ATIVO,
      protocolo: initialData?.protocolo ?? Date.now().toString(),
    },
  });

  const mapEmpresaSistemasToOptions = (empresa: Empresa): Option[] => {
    return (
      empresa.pessoasJuridicasSistemas?.map((item) => ({
        value: item.sistema?.id?.toString?.() || '',
        label:
          item.sistema?.nome ||
          item.sistema?.sistema ||
          item.sistema?.descricao ||
          'Sistema sem nome',
      })) || []
    ).filter((option) => option.value !== '');
  };

  useEffect(() => {
    console.log('empresaId: ');
    const empresaId = watch('empresaId');
    if (empresaId && !sistemasDefinidosPelaEmpresa) {
      pegarSitemas(empresaId);
    }
  }, [watch('empresaId'), sistemasDefinidosPelaEmpresa]);

  // Carregar tipos de ocorrência e ocorrências na montagem
  useEffect(() => {
    buscarOcorrenciasTipos();
    fetchOcorrencias();
  }, [buscarOcorrenciasTipos, fetchOcorrencias]);

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

  // Inicializa sistemas quando em modo edit
  useEffect(() => {
    if (mode === 'edit' && initialData?.empresaId) {
      const loadSistemas = async () => {
        try {
          const sistemasData = await getByEmpresaFormatados(
            initialData.empresaId!
          );
          setSistemas(sistemasData);
          setSistemasDefinidosPelaEmpresa(true);
        } catch (error) {
          console.error('Erro ao carregar sistemas:', error);
        }
      };
      loadSistemas();
    }
  }, [mode, initialData?.empresaId]);

  // Inicializa tipo de ocorrência quando em modo edit
  useEffect(() => {
    if (
      mode === 'edit' &&
      initialData?.ocorrenciaId &&
      ocorrenciasCompleta.length > 0
    ) {
      const ocorrenciaEncontrada = ocorrenciasCompleta.find(
        (oc) => oc.id?.toString() === initialData.ocorrenciaId?.toString()
      );

      if (ocorrenciaEncontrada && ocorrenciaEncontrada.id_ocorrencia_tipo) {
        console.log(
          'Setando tipo de ocorrência:',
          ocorrenciaEncontrada.id_ocorrencia_tipo
        );
        setTipoOcorrenciaId(ocorrenciaEncontrada.id_ocorrencia_tipo.toString());
      }
    }
  }, [mode, initialData?.ocorrenciaId, ocorrenciasCompleta]);

  useEffect(() => {
    if (!pessoaInfo?.id_pessoa_fisica) return;

    const currentPessoaId = getValues('pessoaId');
    const currentUsuarioId = getValues('usuarioId');

    if (!currentPessoaId) {
      setValue('pessoaId', pessoaInfo.id_pessoa_fisica.toString());
    }

    if (!currentUsuarioId) {
      setValue('usuarioId', pessoaInfo.id_pessoa_usuario?.toString() || '');
    }
  }, [
    getValues,
    pessoaInfo?.id_pessoa_fisica,
    pessoaInfo?.id_pessoa_usuario,
    setValue,
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Para o novo endpoint, usamos apenas um arquivo
      if (files.length > 0) {
        setArquivoSelecionado(files[0]);
        setValue('arquivo', files[0]);
      } else {
        setArquivoSelecionado(null);
        setValue('arquivo', undefined);
      }
      // Manter compatibilidade com o antigo annexos array
      setAnexosFiles(files);
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

  const getOcorrenciasFiltradas = (): Option[] => {
    console.log('getOcorrenciasFiltradas chamada');
    console.log(
      'tipoOcorrenciaId:',
      tipoOcorrenciaId,
      'tipo:',
      typeof tipoOcorrenciaId
    );
    console.log('ocorrenciasCompleta:', ocorrenciasCompleta);

    if (!tipoOcorrenciaId) {
      console.log('Retornando vazio - tipoOcorrenciaId está vazio');
      return [];
    }

    const tipoIdNumero = Number(tipoOcorrenciaId);
    console.log('tipoIdNumero:', tipoIdNumero, 'tipo:', typeof tipoIdNumero);

    const resultado =
      ocorrenciasCompleta
        ?.filter((ocorrencia) => {
          console.log('Comparação detalhada:', {
            ocorrenciaId: ocorrencia.id,
            id_ocorrencia_tipo: ocorrencia.id_ocorrencia_tipo,
            tipo_id_ocorrencia_tipo: typeof ocorrencia.id_ocorrencia_tipo,
            tipoIdNumero: tipoIdNumero,
            tipo_tipoIdNumero: typeof tipoIdNumero,
            comparacao_direta: ocorrencia.id_ocorrencia_tipo === tipoIdNumero,
            comparacao_string:
              String(ocorrencia.id_ocorrencia_tipo) === String(tipoIdNumero),
            comparacao_number:
              Number(ocorrencia.id_ocorrencia_tipo) === Number(tipoIdNumero),
          });
          return Number(ocorrencia.id_ocorrencia_tipo) === Number(tipoIdNumero);
        })
        .map((ocorrencia) => ({
          value: ocorrencia.id || 0,
          label: ocorrencia.descricao || '',
        })) || [];

    console.log('Resultado da filtragem:', resultado);
    return resultado;
  };

  const handleTipoOcorrenciaChange = (opt: any) => {
    setTipoOcorrenciaId(opt);
    // Limpar a seleção anterior de ocorrência
    setValue('ocorrenciaId', '');
  };

  const handleFormSubmit = async (data: TicketFormData) => {
    console.log('Dados do formulário antes do submit:', data);
    const formDataWithFiles = {
      ...data,
      anexos: anexosFiles,
    };

    try {
      console.log('Dados do formulário com arquivos:', formDataWithFiles);
      const result = await onSubmit(formDataWithFiles);
      console.log('Resultado do submit:', result);

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
            pessoaId: pessoaInfo?.id_pessoa_fisica || '',
            usuarioId: pessoaInfo?.id_pessoa_usuario || '',
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
        setArquivoSelecionado(null);

        // Resetar componentes autocomplete
        setResetDropzone(true);
        setResetPessoa(true);
        setResetEmpresa(true);

        // Limpar lista de sistemas
        setSistemas([]);
        setSistemasDefinidosPelaEmpresa(false);
      }
    } catch (error) {
      // O erro será tratado no componente pai (CreateTicketPage)
      throw error; // Relança o erro para ser capturado pelo componente pai
    }
  };

  const handleFormInvalid = (formErrors: typeof errors) => {
    console.log('Submit bloqueado por validacao:', formErrors);
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
        <form
          onSubmit={handleSubmit(handleFormSubmit, handleFormInvalid)}
          className="space-y-6"
        >
          {/* Identificação */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <EmpresaAutocomplete
                empresaId={mode === 'edit' ? initialData?.empresaId : undefined}
                initialDisplayValue={mode === 'edit' ? initialEmpresaNome : ''}
                onSelect={(empresa: Empresa | null) => {
                  if (empresa) {
                    setValue('empresaId', empresa.id?.toString() || '');
                    const sistemasEmpresa =
                      mapEmpresaSistemasToOptions(empresa);

                    if (sistemasEmpresa.length > 0) {
                      setSistemasDefinidosPelaEmpresa(true);
                      setSistemas(sistemasEmpresa);
                      // No modo edit, preservar o sistema já selecionado
                      if (mode === 'create') {
                        setValue(
                          'sistemaId',
                          sistemasEmpresa[0].value.toString()
                        );
                      }
                    } else {
                      setSistemasDefinidosPelaEmpresa(false);
                      if (mode === 'create') {
                        setValue('sistemaId', '');
                      }
                    }

                    trigger('empresaId');
                    trigger('sistemaId');
                  } else {
                    setSistemasDefinidosPelaEmpresa(false);
                    setValue('empresaId', '');
                    setValue('sistemaId', '');
                    setSistemas([]);
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
              pessoaId={mode === 'edit' ? initialData?.pessoaId : undefined}
              initialDisplayValue={mode === 'edit' ? initialPessoaNome : ''}
              onSelect={(pessoa: PessoasFisica | null) => {
                if (pessoa) {
                  console.log('Pessoa selecionada no autocomplete:', pessoa);
                  setValue(
                    'pessoaId',
                    (pessoa.id_pessoa?.toString() || pessoa.id?.toString()) ??
                      ''
                  );
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Tipo de Ocorrência *</Label>
              <Select
                options={tiposOcorrencia}
                placeholder="Selecione o Tipo de Ocorrência"
                onChange={(opt: any) => {
                  handleTipoOcorrenciaChange(opt);
                  trigger('ocorrenciaId');
                }}
                value={tipoOcorrenciaId}
              />
            </div>
            <div>
              <Label>Ocorrência *</Label>
              <Select
                options={getOcorrenciasFiltradas()}
                placeholder="Selecione a Ocorrência"
                onChange={(opt: any) => {
                  setValue('ocorrenciaId', opt);
                  trigger('ocorrenciaId');
                }}
                value={watch('ocorrenciaId')}
                emptyMessage="Selecione um tipo de ocorrência primeiro"
              />
              {errors.ocorrenciaId && (
                <p className="text-sm text-red-500">
                  {errors.ocorrenciaId.message}
                </p>
              )}
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
            onFilesChange={(files: File[]) => {
              handleFileChange({ target: { files } } as any);
            }}
            existingAttachments={existingAttachments}
            resetFiles={resetDropzone}
            onResetComplete={handleDropzoneResetComplete}
          />

          <div>
            <Label>Descrição do Anexo (opcional)</Label>
            <Input
              type="text"
              placeholder="Ex: Screenshot do erro, Comprovante, etc"
              value={watch('descricaoAnexo') || ''}
              onChange={(e) => setValue('descricaoAnexo', e.target.value)}
              disabled={!arquivoSelecionado}
            />
            {arquivoSelecionado && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Arquivo selecionado: {arquivoSelecionado.name} (
                {(arquivoSelecionado.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>

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
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={() =>
                console.log('Clique no botao de submit:', getValues())
              }
            >
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
