import { PessoaTipo } from '@/types/pessoaTipo.type';
import api from './api';

const getPessoasTipos = async (): Promise<PessoaTipo[]> => {
  const response = await api.get('pessoa-tipos');
  // console.log(response.data);
  return response.data;
};

const getPessoaTipo = async (id: number) => {
  const response = await api.get(`/pessoa-tipos/${id}`);
  return response.data;
};

const createPessoaTipo = async (data: any) => {
  const response = await api.post('/pessoa-tipos', data);
  return response.data;
};

const updatePessoaTipo = async (id: number, data: PessoaTipo) => {
  const response = await api.put(`/pessoa-tipos/${id}`, data);
  return response.data;
};

const deletePessoaTipo = async (id: number) => {
  const response = await api.delete(`/pessoa-tipos/${id}`);
  return response.data;
};

const getPessoasTiposPorEmpresa = async (
  idEmpresa: number
): Promise<PessoaTipo[]> => {
  const response = await api.get(`/pessoa-tipos/empresa/${idEmpresa}`);
  return response.data;
};

export const PessoaTipoService = {
  getPessoasTipos,
  getPessoaTipo,
  createPessoaTipo,
  updatePessoaTipo,
  deletePessoaTipo,
  getPessoasTiposPorEmpresa,
};
