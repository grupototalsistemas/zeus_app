export interface Ticket {
  id: string;
  protocolo: string;
  entrada: Date;
  hora: string;
  sistema: string;
  serventia: string;
  codigo: string;
  prazo: string;
  ultimaAtualizacao: Date;
  responsavel: string;
  diasAtras: number;
  title: string;
  description: string;
  status: "open" | "closed" | "in-progress";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}