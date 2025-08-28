import { Pessoa } from '@/types/pessoas.type';
import { PessoaUsuarioDTO } from '@/types/pessoaUsuario.type';
import api from './api';

const getPessoas = async (): Promise<Pessoa[]> => {
  const response = await api.get('/pessoas');
  return response.data;
};

const search = async (term: string): Promise<Pessoa[]> => {
  const response = await api.get(`/pessoas/search?term=${encodeURIComponent(term)}`);
  return response.data;
};

const getPessoa = async (id: number) => {
  const response = await api.get(`/pessoas/${id}`);
  return response.data;
};

const createPessoa = async (data: Pessoa) => {
  const response = await api.post('/pessoas', data);
  return response.data;
};

const createPessoaUsuario = async (data: PessoaUsuarioDTO) => {
  const response = await api.post('/pessoa-usuario', data);
  return response.data;
};

const updatePessoa = async (id: number, data: Pessoa) => {
  const response = await api.put(`/pessoa/${id}`, data);
  return response.data;
};

const deletePessoa = async (id: number) => {
  const response = await api.delete(`/pessoa-usuario/${id}`);
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
};
