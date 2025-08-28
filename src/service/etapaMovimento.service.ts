import { ChamadoMovimentoEtapa } from '@/types/chamadoMovimentoEtapa.type';
import api from './api';

const getEtapas = async (): Promise<ChamadoMovimentoEtapa[]> => {
  const response = await api.get('/chamados-movimento-etapas');
  return response.data;
};

const getEtapa = async (id: number): Promise<ChamadoMovimentoEtapa> => {
  const response = await api.get(`/chamados-movimento-etapas/${id}`);
  return response.data;
};

const createEtapa = async (data: Partial<ChamadoMovimentoEtapa>): Promise<ChamadoMovimentoEtapa> => {
  const response = await api.post('/chamados-movimento-etapas', data);
  return response.data;
};

const updateEtapa = async (id: number, data: Partial<ChamadoMovimentoEtapa>): Promise<ChamadoMovimentoEtapa> => {
  const response = await api.put(`/chamados-movimento-etapas/${id}`, data);
  return response.data;
};

const deleteEtapa = async (id: number): Promise<void> => {
  await api.delete(`/chamados-movimento-etapas/${id}`);
};

export const EtapaMovimentoService = {
  getEtapas,
  getEtapa,
  createEtapa,
  updateEtapa,
  deleteEtapa,
};
