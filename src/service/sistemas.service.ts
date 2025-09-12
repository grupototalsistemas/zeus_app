import { Sistema } from '@/types/sistemas.type';
import api from './api';

const getSistemas = async (): Promise<Sistema[]> => {
  const response = await api.get('/sistemas', { params: { ativo: 'ATIVO' } });
  // console.log(response.data)
  return response.data;
};

const getSistema = async (id: number) => {
  const response = await api.get(`/sistemas/${id}`);
  return response.data;
};

const createSistema = async (data: Sistema) => {
  console.log('sistemas: ', data);
  const response = await api.post('/sistemas', data);
  return response.data;
};

const updateSistema = async (id: number, data: Sistema) => {
  const response = await api.patch(`/sistemas/${id}`, data);
  return response.data;
};

const deleteSistema = async (id: number) => {
  const response = await api.patch(`/sistemas/${id}/desactivate`);
  return response.data;
};

export const SistemaService = {
  getSistemas,
  getSistema,
  createSistema,
  updateSistema,
  deleteSistema,
};
