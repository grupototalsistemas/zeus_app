import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import api from './api';

const getTiposOcorrencia = async (): Promise<OcorrenciaTipo[]> => {
  const response = await api.get('/chamado-ocorrencia-tipo');
  console.log(response.data);
  return response.data;
};

const getTipoOcorrencia = async (id: number) => {
  const response = await api.get(`/chamado-ocorrencia-tipo/${id}`);
  return response.data;
};

const createOcorrenciaTipo = async (data: OcorrenciaTipo) => {
  const response = await api.post('/chamado-ocorrencia-tipo', data);
  return response.data;
};

const updateOcorrenciaTipo = async (id: number, data: OcorrenciaTipo) => {
  const response = await api.put(`/chamado-ocorrencia-tipo/${id}`, data);
  return response.data;
};

const deleteOcorrenciaTipo = async (id: number) => {
  const response = await api.delete(`/chamado-ocorrencia-tipo/${id}`);
  return response.data;
};
export const TipoOcorrenciaService = {
  getTiposOcorrencia,
  getTipoOcorrencia,
  createOcorrenciaTipo,
  updateOcorrenciaTipo,
  deleteOcorrenciaTipo,
};
