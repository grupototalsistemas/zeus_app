import { Empresa } from '@/types/empresa.type';
import api from './api';

const getEmpresas = async (params?: {
  id_pessoa_juridica_empresa?: number;
}): Promise<Empresa[]> => {
  const response = await api.get(
    `/pessoa-juridica/fornecedores?id_pessoa_juridica_empresa=${params?.id_pessoa_juridica_empresa}`
  );
  return response.data;
};

const getEmpresa = async (id: number) => {
  const response = await api.get(`/pessoa-juridica/fornecedores/${id}`);
  return response.data;
};

const createEmpresa = async (data: Empresa) => {
  const response = await api.post('/pessoa-juridica/fornecedores', data);
  return response.data;
};

const updateEmpresa = async (id: number, data: Empresa) => {
  const response = await api.put(`/pessoa-juridica/fornecedores/${id}`, data);
  return response.data;
};

const deleteEmpresa = async (id: number) => {
  const response = await api.delete(`/pessoa-juridica/fornecedores/${id}`);
  return response.data;
};

export const EmpresaService = {
  getEmpresas,
  getEmpresa,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
};
