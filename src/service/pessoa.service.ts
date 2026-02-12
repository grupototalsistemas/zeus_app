import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import api from './api';

const getPessoas = async (empresaid: string): Promise<any[]> => {
  const response = await api.get(
    `/pessoas-fisicas/funcionarios/pessoa-juridica/${empresaid}`
  );
  return response.data;
};

const search = async (term: string): Promise<any[]> => {
  const response = await api.get(
    `/pessoas-fisicas/funcionarios/search?term=${encodeURIComponent(term)}`
  );
  return response.data;
};

const getPessoa = async (id: number) => {
  const response = await api.get(`/pessoas-fisicas/funcionarios/${id}`);
  return response.data;
};

const createPessoa = async (data: any) => {
  const response = await api.post('/pessoas-fisicas/funcionarios', data);
  return response.data;
};

const createPessoaUsuario = async (data: PessoaUsuario) => {
  const response = await api.post(
    '/pessoas-fisicas/funcionarios/usuario',
    data
  );
  return response.data;
};

const updatePessoa = async (id: number, data: any) => {
  const response = await api.put(`/pessoas-fisicas/funcionarios/${id}`, data);
  return response.data;
};

const deletePessoa = async (id: number) => {
  const response = await api.delete(`/pessoas-fisicas/funcionarios/${id}`);
  return response.data;
};

const getPessoasByEmpresa = async (empresaId: number) => {
  const response = await api.get(
    `/pessoas-fisicas/funcionarios/empresa/${empresaId}`
  );
  return response.data;
};

const getPessoasByTipo = async (tipoId: number) => {
  const response = await api.get(
    `/pessoas-fisicas/funcionarios/tipo/${tipoId}`
  );
  return response.data;
};

export const PessoaService = {
  getPessoas,
  getPessoa,
  createPessoa,
  updatePessoa,
  deletePessoa,
  createPessoaUsuario,
  search,
  getPessoasByEmpresa,
  getPessoasByTipo,
};
