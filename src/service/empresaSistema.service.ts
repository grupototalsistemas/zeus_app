import { EmpresaSistema } from '@/types/empresaSistema.type';
import api from './api';

const getEmpresaSistemas = async (): Promise<EmpresaSistema[]> => {
  const response = await api.get('/empresas-sistemas');
  return response.data;
};

const getEmpresaSistemaByEmpresa = async (
  empresaId: number
): Promise<EmpresaSistema[]> => {
  const response = await api.get(`/empresas-sistemas/empresa/${empresaId}`);
  return response.data;
};

const getEmpresaSistema = async (id: number) => {
  const response = await api.get(`/empresas-sistemas/${id}`);
  return response.data;
};

const createEmpresaSistema = async (data: EmpresaSistema) => {
  const response = await api.post('/empresas-sistemas', data);
  return response.data;
};

const updateEmpresaSistema = async (id: number, data: EmpresaSistema) => {
  const response = await api.put(`/empresas-sistemas/${id}`, data);
  return response.data;
};

const deleteEmpresaSistema = async (id: number) => {
  const response = await api.delete(`/empresas-sistemas/${id}`);
  return response.data;
};

export const EmpresaSistemaService = {
  getEmpresaSistemas,
  getEmpresaSistema,
  getEmpresaSistemaByEmpresa,
  createEmpresaSistema,
  updateEmpresaSistema,
  deleteEmpresaSistema,
};
