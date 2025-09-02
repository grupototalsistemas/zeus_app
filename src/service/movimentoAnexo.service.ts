import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';
import api from './api';

const getMovimentoAnexos = async (): Promise<ChamadoMovimentoAnexo[]> => {
  const response = await api.get('/movimento-anexos');
  return response.data;
};

const getMovimentoAnexosByMovimento = async (
  movimentoId: number
): Promise<ChamadoMovimentoAnexo[]> => {
  const response = await api.get(`/movimento-anexos/movimento/${movimentoId}`);
  return response.data;
};

const getMovimentoAnexo = async (id: number) => {
  const response = await api.get(`/movimento-anexos/${id}`);
  return response.data;
};

const createMovimentoAnexo = async (data: ChamadoMovimentoAnexo) => {
  const response = await api.post('/movimento-anexos', data);
  return response.data;
};

const updateMovimentoAnexo = async (
  id: number,
  data: ChamadoMovimentoAnexo
) => {
  const response = await api.put(`/movimento-anexos/${id}`, data);
  return response.data;
};

const deleteMovimentoAnexo = async (id: number) => {
  const response = await api.delete(`/movimento-anexos/${id}`);
  return response.data;
};

// Upload de arquivo
const uploadAnexo = async (file: File, movimentoId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('movimentoId', movimentoId.toString());

  const response = await api.post('/movimento-anexos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Download de arquivo
const downloadAnexo = async (id: number) => {
  const response = await api.get(`/movimento-anexos/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

export const MovimentoAnexoService = {
  getMovimentoAnexos,
  getMovimentoAnexosByMovimento,
  getMovimentoAnexo,
  createMovimentoAnexo,
  updateMovimentoAnexo,
  deleteMovimentoAnexo,
  uploadAnexo,
  downloadAnexo,
};
