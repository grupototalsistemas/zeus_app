import { Prioridade } from '@/types/chamadoPrioridade.type';

import api from './api';

const getPrioridades = async (): Promise<Prioridade[]> => {
  const response = await api.get('/priodades');
  console.log(response.data);
  return response.data;
};

const getPrioridade = async (id: number) => {
  const response = await api.get(`/priodades/${id}`);
  return response.data;
};

const createPrioridade = async (data: Prioridade) => {
  console.log('Creating prioridade:', data);
  const response = await api.post('/priodades', data);
  return response.data;
};

const updatePrioridade = async (id: number, data: Prioridade) => {
  const response = await api.put(`/priodades/${id}`, data);
  return response.data;
};

const deletePrioridade = async (id: number) => {
  const response = await api.delete(`/priodades/${id}`);
  return response.data;
};

export const PrioridadeService = {
  getPrioridades,
  getPrioridade,
  createPrioridade,
  updatePrioridade,
  deletePrioridade,
};
