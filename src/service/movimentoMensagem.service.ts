import { ChamadoMovimentoMensagem } from '@/types/chamadoMovimentoMensagem.type';
import api from './api';

const getMovimentoMensagens = async (): Promise<ChamadoMovimentoMensagem[]> => {
  const response = await api.get('/movimento-mensagens');
  return response.data;
};

const getMovimentoMensagensByMovimento = async (
  movimentoId: number
): Promise<ChamadoMovimentoMensagem[]> => {
  const response = await api.get(
    `/movimento-mensagens/movimento/${movimentoId}`
  );
  return response.data;
};

const getMovimentoMensagem = async (id: number) => {
  const response = await api.get(`/chamados-movimentos-mensagens/${id}`);
  return response.data;
};

const createMovimentoMensagem = async (data: ChamadoMovimentoMensagem) => {
  const response = await api.post('/chamados-movimentos-mensagens', data);
  return response.data;
};

const updateMovimentoMensagem = async (
  id: number,
  data: ChamadoMovimentoMensagem
) => {
  const response = await api.put(`/chamados-movimentos-mensagens/${id}`, data);
  return response.data;
};

const deleteMovimentoMensagem = async (id: number) => {
  const response = await api.delete(`/chamados-movimentos-mensagens/${id}`);
  return response.data;
};

export const MovimentoMensagemService = {
  getMovimentoMensagens,
  getMovimentoMensagensByMovimento,
  getMovimentoMensagem,
  createMovimentoMensagem,
  updateMovimentoMensagem,
  deleteMovimentoMensagem,
};
