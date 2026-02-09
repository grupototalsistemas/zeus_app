import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import api from './api';

const getTiposOcorrencia = async (): Promise<OcorrenciaTipo[]> => {
  const response = await api.get('/ocorrencias-tipo');
  console.log(response.data);
  return response.data;
};

const getTipoOcorrencia = async (id: number) => {
  const response = await api.get(`/ocorrencias-tipo/${id}`);
  return response.data;
};

const createOcorrenciaTipo = async (data: OcorrenciaTipo) => {
  const response = await api.post('/ocorrencias-tipo', data);
  return response.data;
};

const updateOcorrenciaTipo = async (id: number, data: OcorrenciaTipo) => {
  const response = await api.put(`/ocorrencias-tipo/${id}`, data);
  return response.data;
};

const deleteOcorrenciaTipo = async (id: number) => {
  const response = await api.delete(`/ocorrencias-tipo/${id}`);
  return response.data;
};
export const TipoOcorrenciaService = {
  getTiposOcorrencia,
  getTipoOcorrencia,
  createOcorrenciaTipo,
  updateOcorrenciaTipo,
  deleteOcorrenciaTipo,
};
