import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import api from './api';

const getOcorrencias = async (): Promise<Ocorrencia[]> => {
  const response = await api.get('/chamado-ocorrencia');
  console.log(response.data);
  return response.data;
};

const getOcorrencia = async (id: number) => {
  const response = await api.get(`/chamado-ocorrencia/${id}`);
  return response.data;
};

const createOcorrencia = async (data: Ocorrencia) => {
  const response = await api.post('/chamado-ocorrencia', data);
  return response.data;
};

const updateOcorrencia = async (id: number, data: Ocorrencia) => {
  const response = await api.put(`/chamado-ocorrencia/${id}`, data);
  return response.data;
};

const deleteOcorrencia = async (id: number) => {
  const response = await api.delete(`/chamado-ocorrencia/${id}`);
  return response.data;
};

export const OcorrenciaService = {
  getOcorrencias,

  getOcorrencia,
  createOcorrencia,

  updateOcorrencia,

  deleteOcorrencia,
};
