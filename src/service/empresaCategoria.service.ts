import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import api from './api';

const getEmpresaCategorias = async (): Promise<EmpresaCategoria[]> => {
  const response = await api.get('/empresas-categorias');
  return response.data;
};

const getEmpresaCategoria = async (id: number) => {
  const response = await api.get(`/empresas-categorias/${id}`);
  return response.data;
};

const createEmpresaCategoria = async (data: EmpresaCategoria) => {
  const response = await api.post('/empresas-categorias', data);
  return response.data;
};

const updateEmpresaCategoria = async (id: number, data: EmpresaCategoria) => {
  const response = await api.put(`/empresas-categorias/${id}`, data);
  return response.data;
};

const deleteEmpresaCategoria = async (id: number) => {
  const response = await api.delete(`/empresas-categorias/${id}`);
  return response.data;
};

export const EmpresaCategoriaService = {
  getEmpresaCategorias,
  getEmpresaCategoria,
  createEmpresaCategoria,
  updateEmpresaCategoria,
  deleteEmpresaCategoria,
};
