'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DropzoneComponent from '../form-elements/DropZone';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import DatePicker from '../date-picker';
import { IPrioridade, StatusRegistro } from '@/types/enum';
import { useAppSelector } from '@/hooks/useRedux';
import { selectEmpresasFormatadas } from '@/store/slices/empresaSlice';
import { dataAgora } from '@/utils/fomata-data';
import { selectOcorrencias, selectOcorrenciasFormatadas } from '@/store/slices/ocorrenciaSlice';
import { selectPrioridades, selectPrioridadesFormatadas } from '@/store/slices/prioridadeSlice';

const ticketSchema = z.object({

  empresaId: z.string().min(1, 'Empresa é obrigatória'),
  sistemaId: z.string().min(1, 'Sistema é obrigatório'),
  pessoaId: z.string().min(1, 'Pessoa é obrigatória'),
  usuarioId: z.string().min(1, 'Usuário é obrigatório'),
  inicio: z.string().optional(),
  sistema: z.string().min(1, 'Sistema é obrigatório'),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  titulo: z.string().min(3, 'Título não pode ser menor que 3 caracteres'),
  descricao: z.string().min(5, 'Descrição é obrigatória'),
  ativo: z.enum(StatusRegistro),
  prioridadeId: z.string().min(1, 'Prioridade é obrigatória'),
  protocolo: z.string().optional(),
  observacao: z.string().optional(),
  ocorrenciaId: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormBaseProps {
  mode: 'create' | 'edit';
  initialData?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => void;
}

export function TicketFormBase({
  mode,
  initialData,
  onSubmit,
}: TicketFormBaseProps) {
  const empresasFormatadas = useAppSelector(selectEmpresasFormatadas);
  const {pessoaInfo}= useSelector((state:RootState)=>state.pessoa)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      sistemaId: initialData?.sistemaId ?? '',
      ocorrenciaId: initialData?.ocorrenciaId ?? '',
      responsavel: initialData?.responsavel ?? (pessoaInfo?.nomeSocial || pessoaInfo?.nome),
      titulo: initialData?.titulo ?? '',
      descricao: initialData?.descricao ?? '',
      ativo: initialData?.ativo ? StatusRegistro.ATIVO : StatusRegistro.INATIVO,
      prioridadeId: initialData?.prioridadeId ?? '',
      inicio: initialData?.inicio ?? '',
      empresaId: initialData?.empresaId ?? '',
      observacao: initialData?.observacao ?? '',
      pessoaId: initialData?.pessoaId ?? '',
      protocolo: initialData?.protocolo ?? '',
      sistema: initialData?.sistema ?? '',
      usuarioId: initialData?.usuarioId ?? '',
      
    },
  });

  // Simulação de opções vindas do backend

  const exemplosSistema = [
    { value: 'Notas', label: 'Notas' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Foodlivre', label: 'Foodlivre' },
  ];
  // Exemplo de sintaxe para enum
  const prioridadesExample = Object.values(IPrioridade).map(p => ({
    value: p,
    label: p
  }));

  const ocorrencia = useSelector(selectOcorrenciasFormatadas);
  const prioridade = useSelector(selectPrioridadesFormatadas);

  const [message, setMessage] = useState(initialData?.descricao || '');

  // Atualiza valores iniciais se vierem depois (edição async)
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value) setValue(key as keyof TicketFormData, value as any);
      });
    }
  }, [initialData, setValue]);

  return (
    <>
      <PageBreadcrumb
        pageTitle={mode === 'create' ? 'Criar Chamado' : 'Editar Chamado'}
        pageBefore="Chamados"
      />
      <ComponentCard
        title={mode === 'create' ? 'Novo Chamado' : 'Editar Chamado'}
      >
        <form onSubmit={handleSubmit((data) => {
          console.log('Form submitted with data:', data);
          console.log('Form errors:', errors);
          onSubmit(data);
        })} className="space-y-6">
          {/* Serventia */}
          <div>
            <Label>Serventia</Label>
            <div className="relative">
              <Select
                options={empresasFormatadas}
                placeholder="Selecione a Serventia "
                onChange={(opt: any) => {
                  setValue('empresaId', opt);
                  trigger('empresaId');
                }}
                value={watch('empresaId')}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.empresaId && (
              <p className="text-sm text-red-500">{errors.empresaId.message}</p>
            )}
          </div>
          
          {/* Itens preenchidos automaticamente e disabled */}
          {/* <div>
              <DatePicker
                id="entrada-chamado"
                label="Entrada"
                placeholder={dataAgora()}
                disabled
              />
            </div> */}
          <div>
            <Label>Responsavel</Label>
            <Input
              type="text"
              placeholder={pessoaInfo?.nomeSocial || pessoaInfo?.nome}
              value={pessoaInfo?.nomeSocial || pessoaInfo?.nome}
              disabled
            />
          </div>
          {/* Campos a serem preenchidos apos a serventia */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Sistema</Label>
              <div className="relative">
                <Select
                  options={exemplosSistema}
                  placeholder="Selecione o sistema "
                  onChange={(opt: any) => {
                    setValue('sistema', opt);
                    trigger('sistema');
                  }}
                  value={watch('sistema')}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.sistema && (
                <p className="text-sm text-red-500">{errors.sistema.message}</p>
              )}
            </div>
            <div>
              <Label>Ocorrência</Label>
              <div className="relative">
                <Select
                  options={ocorrencia}
                  placeholder="Selecione a Ocorrência "
                  onChange={(opt: any) => {
                    setValue('ocorrenciaId', opt);
                    trigger('ocorrenciaId');
                  }}
                  value={watch('ocorrenciaId')}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.ocorrenciaId && (
                <p className="text-sm text-red-500">{errors.ocorrenciaId.message}</p>
              )}
            </div>
            <div>
              <Label>Prioridade</Label>
              <div className="relative">
                <Select
                  options={prioridade}
                  placeholder="Selecione a Prioridade do chamado "
                  onChange={(opt: any) => {
                    setValue('prioridadeId', opt);
                    trigger('prioridadeId');
                  }}
                  value={watch('prioridadeId')}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.prioridadeId && (
                <p className="text-sm text-red-500">{errors.prioridadeId.message}</p>
              )}
            </div>
           
            </div>
            <div>
              <Label>Cliente</Label>
              <Input
                type="text"
                placeholder="Informe o nome do cliente"
                value={watch('pessoaId')}
                onChange={(e) => setValue('pessoaId', e.target.value)}
              />
              {errors.pessoaId && (
                <p className="text-sm text-red-500">
                  {errors.pessoaId.message}
                </p>
              )}
            </div>
            {/* Campos com opcionais */}
            <div>
              <Label>Título</Label>
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
          

          {/* Descrição */}
          <div>
            <Label>Descrição</Label>
            <TextArea
              value={message}
              placeholder="Descreva o chamado"
              onChange={(value) => {
                setMessage(value);
                setValue('descricao', value);
              }}
              rows={6}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">
                {errors.descricao.message}
              </p>
            )}
          </div>
          <DropzoneComponent/>
          {/* Informar alguma mensagem caso necessite*/}
          <div>
              <Label>Mensagem</Label>
              <Input
                type="text"
                placeholder="Informe uma mensagem adicional (opcional) "
                value={watch('observacao')}
                onChange={(e) => setValue('observacao', e.target.value)}
              />
              {errors.observacao && (
                <p className="text-sm text-red-500">
                  {errors.observacao.message}
                </p>
              )}
            </div>
          {/* Botão */}
          <div className="text-right space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                console.log('Form values:', watch());
                console.log('Form errors:', errors);
                console.log('Is form valid:', Object.keys(errors).length === 0);
              }}
            >
              Debug
            </Button>
            <Button 
              size="md" 
              variant="primary" 
              onClick={handleSubmit((data) => {
                console.log('Button click - Form submitted with data:', data);
                onSubmit(data);
              })}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (mode === 'create' ? 'Salvando...' : 'Atualizando...') 
                : (mode === 'create' ? 'Salvar Chamado' : 'Atualizar Chamado')
              }
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
