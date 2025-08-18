import { Perfil, PerfilPermissao, Permissao } from '@/types/perfil.type';
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

const getPermissoes = async (): Promise<Permissao[]> => {
  const response = await api.get('/permissoes');
  return response.data;
};

const getPerfilPermissoes = async (
  idPerfil: number
): Promise<PerfilPermissao[]> => {
  const response = await api.get(`/pessoa-perfil/${idPerfil}/permissoes`);
  return response.data;
};

const updatePerfilPermissoes = async (
  idPerfil: number,
  permissoes: PerfilPermissao[]
) => {
  const response = await api.put(
    `/pessoa-perfil/${idPerfil}/permissoes`,
    permissoes
  );
  return response.data;
};

export const PerfilService = {
  getPerfis,
  getPerfil,
  createPerfil,
  updatePerfil,
  deletePerfil,
  getPermissoes,
  getPerfilPermissoes,
  updatePerfilPermissoes,
};
