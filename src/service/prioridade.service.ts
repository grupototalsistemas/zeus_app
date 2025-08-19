import { Permissao } from '@/types/perfil.type';
import { Prioridade } from '@/types/prioridade.type';
import api from './api';

const getPrioridades = async (): Promise<Prioridade[]> => {
  const response = await api.get('/chamado-prioridade');
  return response.data;
};

const getPrioridade = async (id: number) => {
  const response = await api.get(`/chamado-prioridade/${id}`);
  return response.data;
};

const createPrioridade = async (data: Prioridade) => {
  console.log('Creating prioridade:', data);
  const response = await api.post('/chamado-prioridade', data);
  return response.data;
};

const updatePrioridade = async (id: number, data: Prioridade) => {
  const response = await api.put(`/chamado-prioridade/${id}`, data);
  return response.data;
};

const deletePrioridade = async (id: number) => {
  const response = await api.delete(`/chamado-prioridade/${id}`);
  return response.data;
};

const getPermissoes = async (): Promise<Permissao[]> => {
  const response = await api.get('/permissoes');
  return response.data;
};

export const PrioridadeService = {
  getPrioridades,
  getPrioridade,
  createPrioridade,
  updatePrioridade,
  deletePrioridade,
  getPermissoes,
};
