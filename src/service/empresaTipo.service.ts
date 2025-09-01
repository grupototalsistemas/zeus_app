import { EmpresaTipo } from '@/types/empresaTipo.type';
import api from './api';

const getEmpresaTipos = async (): Promise<EmpresaTipo[]> => {
  const response = await api.get('/empresas-tipos');
  return response.data;
};

const getEmpresaTipo = async (id: number) => {
  const response = await api.get(`/empresas-tipos/${id}`);
  return response.data;
};

const createEmpresaTipo = async (data: EmpresaTipo) => {
  const response = await api.post('/empresas-tipos', data);
  return response.data;
};

const updateEmpresaTipo = async (id: number, data: EmpresaTipo) => {
  const response = await api.put(`/empresas-tipos/${id}`, data);
  return response.data;
};

const deleteEmpresaTipo = async (id: number) => {
  const response = await api.delete(`/empresas-tipos/${id}`);
  return response.data;
};

export const EmpresaTipoService = {
  getEmpresaTipos,
  getEmpresaTipo,
  createEmpresaTipo,
  updateEmpresaTipo,
  deleteEmpresaTipo,
};
