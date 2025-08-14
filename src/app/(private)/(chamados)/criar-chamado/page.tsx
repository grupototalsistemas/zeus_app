'use client';

import {
  TicketFormBase,
  TicketFormData,
} from '@/components/form/ticket/TicketForm';
import { mapChamados } from '@/helpers/mapChamados';
import { ChamadoService } from '@/service/chamado.service';

export default function CreateTicketPage() {
  const handleCreate = async (data: TicketFormData) => {
    console.log('Novo chamado criado:', data);
    const chamadoData = mapChamados(data);
    console.log('Dados mapeados para criação do chamado:', chamadoData);
    const response = await ChamadoService.createChamado(chamadoData);
    console.log('Resposta do servidor:', response);
    // Aqui você pode redirecionar ou mostrar uma mensagem de sucesso

  };

  return <TicketFormBase mode="create" onSubmit={handleCreate} />;
}
