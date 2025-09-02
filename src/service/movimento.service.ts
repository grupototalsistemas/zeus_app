import { ChamadoMovimento } from '@/types/chamadoMovimento.type';
import api from './api';

const getMovimentos = async (): Promise<ChamadoMovimento[]> => {
  const response = await api.get('/movimentos');
  return response.data;
};

const getMovimentosByChamado = async (
  chamadoId: number
): Promise<ChamadoMovimento[]> => {
  const response = await api.get(`/movimentos/chamado/${chamadoId}`);
  return response.data;
};

const getMovimento = async (id: number) => {
  const response = await api.get(`/movimentos/${id}`);
  return response.data;
};

const createMovimento = async (data: ChamadoMovimento) => {
  const response = await api.post('/movimentos', data);
  return response.data;
};

const updateMovimento = async (id: number, data: ChamadoMovimento) => {
  const response = await api.put(`/movimentos/${id}`, data);
  return response.data;
};

const deleteMovimento = async (id: number) => {
  const response = await api.delete(`/movimentos/${id}`);
  return response.data;
};

export const MovimentoService = {
  getMovimentos,
  getMovimentosByChamado,
  getMovimento,
  createMovimento,
  updateMovimento,
  deleteMovimento,
};
