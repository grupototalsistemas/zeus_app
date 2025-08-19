import { Permissao } from '@/types/perfil.type';
import { Prioridade } from '@/types/prioridade.type';
import api from './api';

const getPrioridades = async (): Promise<Prioridade[]> => {
  const response = await api.get('/pessoa-prioridade');
  return response.data;
};

const getPrioridade = async (id: number) => {
  const response = await api.get(`/pessoa-prioridade/${id}`);
  return response.data;
};

const createPrioridade = async (data: Prioridade) => {
  const response = await api.post('/pessoa-prioridade', data);
  return response.data;
};

const updatePrioridade = async (id: number, data: Prioridade) => {
  const response = await api.put(`/pessoa-prioridade/${id}`, data);
  return response.data;
};

const deletePrioridade = async (id: number) => {
  const response = await api.delete(`/pessoa-prioridade/${id}`);
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
