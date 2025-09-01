import {
  clearCurrentOcorrenciaTipo,
  clearError,
  createOcorrenciaTipo,
  deleteOcorrenciaTipo,
  fetchOcorrenciaTipoById,
  fetchOcorrenciaTipos,
  selectCurrentOcorrenciaTipo,
  selectOcorrenciaTipoError,
  selectOcorrenciaTipoLoading,
  selectOcorrenciaTipos,
  updateOcorrenciaTipo,
} from '@/store/slices/ocorrenciaTipoSlice';
import { AppDispatch } from '@/store/store';
import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useOcorrenciaTipo = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Seletores
  const ocorrenciasTipos = useSelector(selectOcorrenciaTipos);
  const ocorrenciaTipoSelecionado = useSelector(selectCurrentOcorrenciaTipo);
  const loading = useSelector(selectOcorrenciaTipoLoading);
  const error = useSelector(selectOcorrenciaTipoError);

  // Ações assíncronas
  const buscarOcorrenciasTipos = useCallback(async () => {
    try {
      await dispatch(fetchOcorrenciaTipos());
    } catch (error) {
      console.error('Erro ao buscar tipos de ocorrências:', error);
    }
  }, [dispatch]);

  const buscarOcorrenciaTipoPorId = useCallback(
    async (id: number) => {
      try {
        await dispatch(fetchOcorrenciaTipoById(id));
      } catch (error) {
        console.error('Erro ao buscar tipo de ocorrência:', error);
      }
    },
    [dispatch]
  );

  const criarOcorrenciaTipo = useCallback(
    async (data: OcorrenciaTipo) => {
      try {
        const resultado = await dispatch(createOcorrenciaTipo(data));
        return resultado.payload as OcorrenciaTipo;
      } catch (error) {
        console.error('Erro ao criar tipo de ocorrência:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const editarOcorrenciaTipo = useCallback(
    async (id: number, data: OcorrenciaTipo) => {
      try {
        const resultado = await dispatch(updateOcorrenciaTipo({ id, data }));
        return resultado.payload as OcorrenciaTipo;
      } catch (error) {
        console.error('Erro ao editar tipo de ocorrência:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const excluirOcorrenciaTipo = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteOcorrenciaTipo(id));
      } catch (error) {
        console.error('Erro ao excluir tipo de ocorrência:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Ações síncronas
  const limparOcorrenciaTipoSelecionado = useCallback(() => {
    dispatch(clearCurrentOcorrenciaTipo());
  }, [dispatch]);

  const limparErro = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Funções utilitárias
  const obterOcorrenciaTipoPorId = useCallback(
    (id: number) => {
      return ocorrenciasTipos.find((ot) => ot.id === id);
    },
    [ocorrenciasTipos]
  );

  const obterOcorrenciasTiposAtivos = useCallback(() => {
    return ocorrenciasTipos.filter((ot) => ot.ativo === 'ATIVO');
  }, [ocorrenciasTipos]);

  const obterOcorrenciasTiposFormatados = useCallback(() => {
    return ocorrenciasTipos.map((ot) => ({
      value: ot.id || 0,
      label: ot.descricao,
    }));
  }, [ocorrenciasTipos]);

  return {
    // Estado
    ocorrenciasTipos,
    ocorrenciaTipoSelecionado,
    loading,
    error,

    // Getters formatados
    obterOcorrenciasTiposAtivos,
    obterOcorrenciasTiposFormatados,
    obterOcorrenciaTipoPorId,

    // Ações assíncronas
    buscarOcorrenciasTipos,
    buscarOcorrenciaTipoPorId,
    criarOcorrenciaTipo,
    editarOcorrenciaTipo,
    excluirOcorrenciaTipo,

    // Ações síncronas
    limparOcorrenciaTipoSelecionado,
    limparErro,
  };
};
