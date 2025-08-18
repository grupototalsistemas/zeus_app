import { Tipo } from '@/types/tipo.type';
import api from './api';

const getTipos = async (): Promise<Tipo[]> => {
  const response = await api.get('pessoa-tipos');
  console.log(response.data);
  return response.data;
};

const getTipo = async (id: number) => {
  const response = await api.get(`/pessoa-tipos/${id}`);
  return response.data;
};

const createTipo = async (data: any) => {
  const response = await api.post('/pessoa-tipos', data);
  return response.data;
};

const updateTipo = async (id: number, data: Tipo) => {
  const response = await api.put(`/pessoa-tipos/${id}`, data);
  return response.data;
};

const deleteTipo = async (id: number) => {
  const response = await api.delete(`/pessoa-tipos/${id}`);
  return response.data;
};

const getTiposPorEmpresa = async (idEmpresa: number): Promise<Tipo[]> => {
  const response = await api.get(`/empresa/${idEmpresa}/tipos`);
  return response.data;
};

export const TipoService = {
  getTipos,
  getTipo,
  createTipo,
  updateTipo,
  deleteTipo,
  getTiposPorEmpresa,
};
