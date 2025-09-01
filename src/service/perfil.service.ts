import { Perfil } from '@/types/pessoaPerfil.type';
import api from './api';

const getPerfis = async (): Promise<Perfil[]> => {
  const response = await api.get('/pessoa-perfil');
  return response.data;
};

const getPerfil = async (id: number) => {
  const response = await api.get(`/pessoa-perfil/${id}`);
  return response.data;
};

const createPerfil = async (data: Perfil) => {
  const response = await api.post('/pessoa-perfil', data);
  return response.data;
};

const updatePerfil = async (id: number, data: Perfil) => {
  const response = await api.put(`/pessoa-perfil/${id}`, data);
  return response.data;
};

const deletePerfil = async (id: number) => {
  const response = await api.delete(`/pessoa-perfil/${id}`);
  return response.data;
};

export const PerfilService = {
  getPerfis,
  getPerfil,
  createPerfil,
  updatePerfil,
  deletePerfil,
};
