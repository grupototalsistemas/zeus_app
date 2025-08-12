import { Chamado } from '@/types/chamado.type';
import api from './api';

const getChamados = async (): Promise<Chamado[]> => {
  const response = await api.get('/chamados');
  return response.data;
};

const getChamado = async (id: number) => {
  const response = await api.get(`/chamado/${id}`);
  return response.data;
};

const createChamado = async (data: Chamado) => {
  const response = await api.post('/chamado', data);
  return response.data;
};

const updateChamado = async (id: number, data: Chamado) => {
  const response = await api.put(`/chamado/${id}`, data);
  return response.data;
};

const deleteChamado = async (id: number) => {
  const response = await api.delete(`/chamado/${id}`);
  return response.data;
};

export const ChamadoService = {
  getChamados,
  getChamado,
  createChamado,
  updateChamado,
  deleteChamado,
};
