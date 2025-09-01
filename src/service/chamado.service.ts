import { Chamado, CreateChamadoDto } from '@/types/chamado.type';
import api from './api';

const getChamados = async (): Promise<Chamado[]> => {
  const response = await api.get('/chamados');
  return response.data;
};

const getChamado = async (id: number) => {
  const response = await api.get(`/chamados/${id}`);
  return response.data;
};

const createChamado = async (data: CreateChamadoDto & { anexos?: File[] }) => {
  try {
    // 1. Primeiro, criar o chamado (sem anexos)
    const { anexos, ...chamadoData } = data;

    const response = await api.post('/chamados', chamadoData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const chamadoCriado = response.data;

    // 2. Se há anexos e o chamado tem movimento, fazer upload dos anexos
    if (anexos && anexos.length > 0 && chamadoCriado.movimentos?.length > 0) {
      const movimentoId = chamadoCriado.movimentos[0].id;
      await uploadAnexos(movimentoId, anexos, 'Anexos do chamado');

      // 3. Buscar o chamado atualizado com os anexos
      return getChamado(chamadoCriado.id);
    }

    return chamadoCriado;
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

const uploadAnexos = async (
  movimentoId: number,
  arquivos: File[],
  descricao: string = 'Anexo'
) => {
  if (!arquivos || arquivos.length === 0) {
    throw new Error('Nenhum arquivo fornecido');
  }

  const formData = new FormData();

  // Adicionar dados obrigatórios
  formData.append('movimentoId', movimentoId.toString());
  formData.append('descricao', descricao);

  // Adicionar arquivos
  arquivos.forEach((arquivo) => {
    formData.append('files', arquivo);
  });

  const response = await api.post('/chamados/upload-anexos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const downloadAnexo = async (anexoId: number, nomeArquivo?: string) => {
  try {
    const response = await api.get(`/chamados/anexo/${anexoId}`, {
      responseType: 'blob', // importante para download de arquivos
    });

    // Criar URL do blob para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Nome do arquivo - usar o fornecido ou um padrão
    const fileName = nomeArquivo || `anexo-${anexoId}`;
    link.setAttribute('download', fileName);

    // Trigger do download
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Limpar URL do blob
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar anexo:', error);
    throw error;
  }
};

const updateChamado = async (id: number, data: any) => {
  const response = await api.patch(`/chamados/${id}`, data);
  return response.data;
};

const deleteChamado = async (id: number) => {
  const response = await api.delete(`/chamados/${id}`);
  return response.data;
};

// Função auxiliar para adicionar anexos a um movimento existente
const adicionarAnexosAoMovimento = async (
  movimentoId: number,
  anexos: File[],
  descricao: string = 'Anexo adicional'
) => {
  return uploadAnexos(movimentoId, anexos, descricao);
};

const getChamadosByEmpresa = async (empresaId: number): Promise<Chamado[]> => {
  const response = await api.get(`/chamados/empresa/${empresaId}`);
  return response.data;
};

const getChamadosByResponsavel = async (
  responsavelId: number
): Promise<Chamado[]> => {
  const response = await api.get(`/chamados/responsavel/${responsavelId}`);
  return response.data;
};

export const ChamadoService = {
  getChamados,
  getChamado,
  createChamado,
  uploadAnexos,
  downloadAnexo,
  updateChamado,
  deleteChamado,
  adicionarAnexosAoMovimento,
  getChamadosByEmpresa,
  getChamadosByResponsavel,
};
