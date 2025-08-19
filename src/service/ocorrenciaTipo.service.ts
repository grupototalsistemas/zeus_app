import { Ocorrencia, OcorrenciaTipo } from '@/types/ocorrencia.type';
import api from './api';

const getOcorrencias = async (): Promise<Ocorrencia[]> => {
  const response = await api.get('/chamado-ocorrencia-tipo');
  console.log(response.data);
  return response.data;
};

const getOcorrencia = async (id: number) => {
  const response = await api.get(`/ocorrencia/${id}`);
  return response.data;
};

const createOcorrencia = async (data: Ocorrencia) => {
  const response = await api.post('/chamado-ocorrencia-tipo', data);
  return response.data;
};

const createOcorrenciaTipo = async (data: OcorrenciaTipo) => {
  const response = await api.post('/chamado-ocorrencia-tipo', data);
  return response.data;
};

const updateOcorrencia = async (id: number, data: Ocorrencia) => {
  const response = await api.put(`/ocorrencia/${id}`, data);
  return response.data;
};

const updateOcorrenciaTipo = async (id: number, data: OcorrenciaTipo) => {
  const response = await api.put(`/ocorrencia/${id}`, data);
  return response.data;
};

const deleteOcorrencia = async (id: number) => {
  const response = await api.delete(`/ocorrencia/${id}`);
  return response.data;
};

const deleteOcorrenciaTipo = async (id: number) => {
  const response = await api.delete(`/ocorrencia/${id}`);
  return response.data;
};
export const TipoOcorrenciaService = {
  getOcorrencias,
  getOcorrencia,
  createOcorrencia,
  createOcorrenciaTipo,
  updateOcorrencia,
  updateOcorrenciaTipo,
  deleteOcorrencia,
  deleteOcorrenciaTipo,
};
