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

const ticketSchema = z.object({
  protocolo: z.string().min(3, 'Protocolo é obrigatório'),
  entrada: z.string().optional(),
  hora: z.string().optional(),
  sistema: z.string().min(1, 'Sistema é obrigatório'),
  serventia: z.string().min(1, 'Serventia é obrigatória'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  title: z.string().min(3, 'Título é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  status: z.enum(['open', 'closed', 'in-progress']),
  priority: z.enum(['low', 'medium', 'high']),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: initialData,
  });

  // Simulação de opções vindas do backend
  const responsaveisExample = [
    { value: 'user1', label: 'User 1' },
    { value: 'user2', label: 'User 2' },
    { value: 'user3', label: 'User 3' },
  ];
  const statusOptions = [
    { value: 'open', label: 'Aberto' },
    { value: 'closed', label: 'Fechado' },
    { value: 'in-progress', label: 'Em andamento' },
  ];
  const prioridadesExample = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Protocolo */}
          <div>
            <Label>Protocolo</Label>
            <Input
              type="text"
              placeholder="Informe o protocolo"
              //   {...register("protocolo")}
              defaultValue={initialData?.protocolo}
            />
            {errors.protocolo && (
              <p className="text-sm text-red-500">{errors.protocolo.message}</p>
            )}
          </div>

          {/* Campos diversos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Sistema</Label>
              <Input
                type="text"
                placeholder="Informe o sistema"
                defaultValue={initialData?.sistema}
              />
              {errors.sistema && (
                <p className="text-sm text-red-500">{errors.sistema.message}</p>
              )}
            </div>

            <div>
              <Label>Serventia</Label>
              <Input
                type="text"
                placeholder="Informe a serventia"
                defaultValue={initialData?.serventia}
              />
              {errors.serventia && (
                <p className="text-sm text-red-500">
                  {errors.serventia.message}
                </p>
              )}
            </div>

            <div>
              <Label>Código</Label>
              <Input
                type="text"
                placeholder="Informe o código"
                defaultValue={initialData?.codigo}
              />
              {errors.codigo && (
                <p className="text-sm text-red-500">{errors.codigo.message}</p>
              )}
            </div>

            <div>
              <Label>Prazo</Label>
              <Input
                type="text"
                placeholder="Informe o prazo"
                defaultValue={initialData?.prazo}
              />
              {errors.prazo && (
                <p className="text-sm text-red-500">{errors.prazo.message}</p>
              )}
            </div>

            <div>
              <Label>Responsável</Label>
              <div className="relative">
                <Select
                  options={responsaveisExample}
                  placeholder="Selecionar responsável"
                  onChange={(opt: any) => setValue('responsavel', opt.value)}
                  defaultValue={
                    responsaveisExample.find(
                      (r) => r.value === initialData?.responsavel
                    )?.value
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
              {errors.responsavel && (
                <p className="text-sm text-red-500">
                  {errors.responsavel.message}
                </p>
              )}
            </div>

            <div>
              <Label>Título</Label>
              <Input
                type="text"
                placeholder="Informe um título"
                defaultValue={initialData?.title}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
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

          {/* Status e Prioridade */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Status</Label>
              <div className="relative">
                <Select
                  options={statusOptions}
                  placeholder="Selecione o status"
                  onChange={(opt: any) => setValue('status', opt.value)}
                  defaultValue={
                    statusOptions.find((s) => s.value === initialData?.status)
                      ?.value
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div>
              <Label>Prioridade</Label>
              <div className="relative">
                <Select
                  options={prioridadesExample}
                  placeholder="Selecione a prioridade"
                  onChange={(opt: any) => setValue('priority', opt.value)}
                  defaultValue={
                    prioridadesExample.find(
                      (p) => p.value === initialData?.priority
                    )?.value
                  }
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Botão */}
          <div className="text-right">
            <Button size="md" variant="primary">
              {mode === 'create' ? 'Salvar Chamado' : 'Atualizar Chamado'}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
