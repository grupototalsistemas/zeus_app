import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import api from './api';

const getPessoaUsuarios = async (): Promise<PessoaUsuario[]> => {
  const response = await api.get('/pessoa-usuario');
  return response.data;
};

const getPessoaUsuario = async (id: number) => {
  const response = await api.get(`/pessoa-usuario/${id}`);
  return response.data;
};

const getPessoaUsuarioByPessoa = async (pessoaId: number) => {
  const response = await api.get(`/pessoa-usuario/pessoa/${pessoaId}`);
  return response.data;
};

const createPessoaUsuario = async (data: PessoaUsuario) => {
  const response = await api.post('/pessoa-usuario', data);
  return response.data;
};

const updatePessoaUsuario = async (id: number, data: PessoaUsuario) => {
  const response = await api.put(`/pessoa-usuario/${id}`, data);
  return response.data;
};

const deletePessoaUsuario = async (id: number) => {
  const response = await api.delete(`/pessoa-usuario/${id}`);
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
