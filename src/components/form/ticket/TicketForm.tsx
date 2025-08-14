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
import { IPrioridade } from '@/types/enum';
import { useAppSelector } from '@/hooks/useRedux';
import { selectEmpresasFormatadas } from '@/store/slices/empresaSlice';
import { dataAgora } from '@/utils/fomata-data';

const ticketSchema = z.object({

  hora: z.string().optional(),
  sistema: z.string().min(1, 'Sistema é obrigatório'),
  serventia: z.string().min(1, 'Serventia é obrigatória'),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  title: z.string().min(3, 'Título é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  status: z.enum(['open', 'closed', 'in-progress']),
  prioridade: z.enum(IPrioridade),
  cliente: z.string().min(3, 'Cliente é obrigatório'),
  messagem_chamado: z.string().optional(),
  ocorrencia: z.string().optional(),
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
      sistema: initialData?.sistema ?? '',
      serventia: initialData?.serventia ?? '',
      ocorrencia: initialData?.ocorrencia ?? '',
      prazo: initialData?.prazo ?? '',
      responsavel: initialData?.responsavel ?? (pessoaInfo?.nomeSocial || pessoaInfo?.nome),
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'open',
      prioridade: initialData?.prioridade ?? IPrioridade.PEQUENA,
      hora: initialData?.hora ?? '',
      cliente: initialData?.cliente ?? '',
      messagem_chamado: initialData?.messagem_chamado ?? '',
      // protocolo: initialData?.protocolo ?? '',
      // entrada: initialData?.entrada ?? dataAgora(),
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

  const [message, setMessage] = useState(initialData?.description || '');

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
                  setValue('serventia', opt);
                  trigger('serventia');
                }}
                value={watch('serventia')}
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.serventia && (
              <p className="text-sm text-red-500">{errors.serventia.message}</p>
            )}
          </div>
          
          {/* Itens preenchidos automaticamente e disabled */}
          <div>
              <DatePicker
                id="entrada-chamado"
                label="Entrada"
                placeholder={dataAgora()}
                disabled
              />
            </div>
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
                  options={exemplosSistema}
                  placeholder="Selecione a Ocorrência "
                  onChange={(opt: any) => {
                    setValue('ocorrencia', opt);
                    trigger('ocorrencia');
                  }}
                  value={watch('ocorrencia')}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.ocorrencia && (
                <p className="text-sm text-red-500">{errors.ocorrencia.message}</p>
              )}
            </div>
            <div>
              <Label>Prioridade</Label>
              <div className="relative">
                <Select
                  options={prioridadesExample}
                  placeholder="Selecione a Prioridade do chamado "
                  onChange={(opt: any) => {
                    setValue('prioridade', opt);
                    trigger('prioridade');
                  }}
                  value={watch('prioridade')}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.prioridade && (
                <p className="text-sm text-red-500">{errors.prioridade.message}</p>
              )}
            </div>
            <div>
              <DatePicker
                id="prazo-chamado"
                label="Prazo"
                placeholder="Informe um prazo para o chamado"
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  setValue('prazo', dates[0]?.toISOString() || '');
                }}
              />
            </div>
              {errors.prazo && (
                <p className="text-sm text-red-500">{errors.prazo.message}</p>
              )}
            </div>
            <div>
              <Label>Cliente</Label>
              <Input
                type="text"
                placeholder="Informe o nome do cliente"
                value={watch('cliente')}
                onChange={(e) => setValue('cliente', e.target.value)}
              />
              {errors.cliente && (
                <p className="text-sm text-red-500">
                  {errors.cliente.message}
                </p>
              )}
            </div>
            {/* Campos com opcionais */}
            <div>
              <Label>Título</Label>
              <Input
                type="text"
                placeholder="Informe um título"
                value={watch('title')}
                onChange={(e) => setValue('title', e.target.value)}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
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
                setValue('description', value);
              }}
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
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
                value={watch('messagem_chamado')}
                onChange={(e) => setValue('messagem_chamado', e.target.value)}
              />
              {errors.messagem_chamado && (
                <p className="text-sm text-red-500">
                  {errors.messagem_chamado.message}
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
