import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import api from './api';

const getOcorrencias = async (): Promise<Ocorrencia[]> => {
  const response = await api.get('/ocorrencias');
  console.log(response.data);
  return response.data;
};

const getOcorrencia = async (id: number) => {
  const response = await api.get(`/ocorrencias/${id}`);
  return response.data;
};

const createOcorrencia = async (data: Ocorrencia) => {
  const response = await api.post('/ocorrencias', data);
  return response.data;
};

const updateOcorrencia = async (id: number, data: Ocorrencia) => {
  const response = await api.put(`/ocorrencias/${id}`, data);
  return response.data;
};

const deleteOcorrencia = async (id: number) => {
  const response = await api.delete(`/ocorrencias/${id}`);
  return response.data;
};

export const OcorrenciaService = {
  getOcorrencias,

  getOcorrencia,
  createOcorrencia,

  updateOcorrencia,

  deleteOcorrencia,
};
