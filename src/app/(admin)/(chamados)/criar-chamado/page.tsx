'use client';

import {
  TicketFormBase,
  TicketFormData,
} from '@/components/form/ticket/TicketForm';

export default function CreateTicketPage() {
  const handleCreate = (data: TicketFormData) => {
    console.log('Novo chamado criado:', data);
  };

  return <TicketFormBase mode="create" onSubmit={handleCreate} />;
}
