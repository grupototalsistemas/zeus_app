import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import api from './api';

const getPessoaUsuarios = async (): Promise<PessoaUsuario[]> => {
  const response = await api.get('/pessoas-usuarios');
  return response.data;
};

const getPessoaUsuario = async (id: number) => {
  const response = await api.get(`/pessoas-usuarios/${id}`);
  return response.data;
};

const getPessoaUsuarioByPessoa = async (pessoaId: number) => {
  const response = await api.get(`/pessoas-usuarios/pessoa/${pessoaId}`);
  return response.data;
};

const createPessoaUsuario = async (data: PessoaUsuario) => {
  const response = await api.post('/pessoas-usuarios', data);
  return response.data;
};

const updatePessoaUsuario = async (id: number, data: PessoaUsuario) => {
  const response = await api.put(`/pessoas-usuarios/${id}`, data);
  return response.data;
};

const deletePessoaUsuario = async (id: number) => {
  const response = await api.delete(`/pessoas-usuarios/${id}`);
  return response.data;
};

export const PessoaUsuarioService = {
  getPessoaUsuarios,
  getPessoaUsuario,
  getPessoaUsuarioByPessoa,
  createPessoaUsuario,
  updatePessoaUsuario,
  deletePessoaUsuario,
};
