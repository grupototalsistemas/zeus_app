import { EmpresaTipo } from '@/types/empresaTipo.type';
import api from './api';

const getEmpresaTipos = async (): Promise<EmpresaTipo[]> => {
  const response = await api.get('/empresas-tipos', {
    params: { ativo: 'ATIVO' },
  });
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
  const response = await api.patch(`/empresas-tipos/${id}`, data);
  return response.data;
};

//deleção logica
const deleteEmpresaTipo = async (id: number) => {
  const response = await api.patch(`/empresas-tipos/${id}/desactivate`);
  return response.data;
};

export const EmpresaTipoService = {
  getEmpresaTipos,
  getEmpresaTipo,
  createEmpresaTipo,
  updateEmpresaTipo,
  deleteEmpresaTipo,
};
