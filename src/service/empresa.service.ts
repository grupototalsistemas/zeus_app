import { Empresa } from '@/types/empresa.type';
import api from './api';

const getEmpresas = async (): Promise<Empresa[]> => {
  const response = await api.get('/empresas');
  // console.log(response.data)
  return response.data;
};

const getEmpresa = async (id: number) => {
  const response = await api.get(`/empresa/${id}`);
  return response.data;
};

const createEmpresa = async (data: Empresa) => {
  const response = await api.post('/empresa', data);
  return response.data;
};

const updateEmpresa = async (id: number, data: Empresa) => {
  const response = await api.put(`/empresa/${id}`, data);
  return response.data;
};

const deleteEmpresa = async (id: number) => {
  const response = await api.delete(`/empresa/${id}`);
  return response.data;
};

export const EmpresaService = {
  getEmpresas,
  getEmpresa,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
};
