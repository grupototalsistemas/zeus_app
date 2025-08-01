'use client';

import {
  TicketFormBase,
  TicketFormData,
} from '@/components/form/ticket/TicketForm';
import { tickets } from '@/components/tables/ticket.example';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    // Busca local por enquanto (substituir por API)
    const found = tickets.find((t) => t.id === id);
    setTicket(found || null);
  }, [id]);

  const handleEdit = (data: TicketFormData) => {
    console.log('Chamado atualizado:', data);
    // Aqui poderia chamar API PUT para salvar
  };

  if (!ticket) return <div>Carregando...</div>;

  return (
    <TicketFormBase mode="edit" initialData={ticket} onSubmit={handleEdit} />
  );
}
