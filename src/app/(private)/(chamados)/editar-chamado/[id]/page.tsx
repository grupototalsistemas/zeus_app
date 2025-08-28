'use client';

import {
  TicketFormBase,
  TicketFormData,
} from '@/components/form/ticket/TicketForm';
import { ChamadoService } from '@/service/chamado.service';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTicketFromAPI = async (id: string) => {
      // Simula uma chamada de API
      const response = await ChamadoService.getChamado(Number(id));
      console.log(" response: ",response);
      
      setTicket(response);
    };

    // Busca local por enquanto (substituir por API)
  
      fetchTicketFromAPI(id?.toString() || '0');
    
    
  }, [id]);

  const handleEdit = async (data: TicketFormData) => {
    console.log('Chamado atualizado:', data);
    const response = await ChamadoService.updateChamado(Number(id), data);
    console.log('Resposta da API:', response);
    // Aqui poderia chamar API PUT para salvar
  };

  if (!ticket) return <div>Carregando...</div>;

  return (
    <TicketFormBase mode="edit" initialData={ticket} onSubmit={handleEdit} />
  );
}
