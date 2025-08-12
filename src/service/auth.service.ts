import { PessoaUsuarioDTO } from '@/types/pessoaUsuario.type';
import api from './api';

const login = async (login: string, senha: string) => {
  const res = await api.post('/auth/login', { login, senha });
  return res.data;
};

const register = async (data: PessoaUsuarioDTO) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

const resetPassword = async (email: string) => {
  const response = await api.post('/auth/reset-password', { email });
  return response.data;
};

const changePassword = async (data: any) => {
  const response = await api.post('/auth/change-password', data);
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const updateProfile = async (data: any) => {
  const response = await api.put('/auth/me', data);
  return response.data;
};

export const AuthService = {
  login,
  logout,
  getProfile,
  updateProfile,
  register,
  resetPassword,
  changePassword,
};
