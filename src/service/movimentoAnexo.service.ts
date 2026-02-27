import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';
import api from './api';

const getMovimentoAnexos = async (): Promise<ChamadoMovimentoAnexo[]> => {
  const response = await api.get('/chamados-movimentos-anexos');
  return response.data;
};

const getMovimentoAnexosByMovimento = async (
  movimentoId: number
): Promise<ChamadoMovimentoAnexo[]> => {
  const response = await api.get(
    `/chamados-movimentos-anexos/movimento/${movimentoId}`
  );
  return response.data;
};

const getMovimentoAnexo = async (id: number) => {
  const response = await api.get(`/chamados-movimentos-anexos/${id}`);
  return response.data;
};

const createMovimentoAnexo = async (data: ChamadoMovimentoAnexo) => {
  const response = await api.post('/chamados-movimentos-anexos', data);
  return response.data;
};

const updateMovimentoAnexo = async (
  id: number,
  data: ChamadoMovimentoAnexo
) => {
  const response = await api.put(`/chamados-movimentos-anexos/${id}`, data);
  return response.data;
};

const deleteMovimentoAnexo = async (id: number) => {
  const response = await api.delete(`/chamados-movimentos-anexos/${id}`);
  return response.data;
};

// Upload de arquivo
const uploadAnexo = async (file: File, movimentoId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('movimentoId', movimentoId.toString());

  const response = await api.post(
    '/chamados-movimentos-anexos/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Download de arquivo
const downloadAnexo = async (id: number) => {
  const response = await api.get(`/chamados-movimentos-anexos/${id}/download`, {
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
