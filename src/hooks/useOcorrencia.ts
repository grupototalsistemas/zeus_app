import {
  clearError,
  clearOcorrencia,
  createOcorrencia,
  deleteOcorrenciaAsync,
  fetchOcorrencias,
  selectError,
  selectLoading,
  selectOcorrencias,
  selectOcorrenciasAtivas,
  selectOcorrenciaSelecionada,
  selectOcorrenciasFormatadas,
  setOcorrenciaSelecionada,
  updateOcorrenciaAsync,
} from '@/store/slices/ocorrenciaSlice';
import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useOcorrencia = () => {
  const dispatch = useAppDispatch();

  // Seletores

  const ocorrencias = useAppSelector(selectOcorrencias);
  const ocorrenciaSelecionada = useAppSelector(selectOcorrenciaSelecionada);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const ocorrenciasFormatadas = useAppSelector(selectOcorrenciasFormatadas);
  const ocorrenciasAtivas = useAppSelector(selectOcorrenciasAtivas);

  // Ações assíncronas para Ocorrências
  const handleFetchOcorrencias = useCallback(() => {
    return dispatch(fetchOcorrencias());
  }, [dispatch]);

  const handleCreateOcorrencia = useCallback(
    (ocorrencia: Omit<Ocorrencia, 'id'>) => {
      return dispatch(createOcorrencia(ocorrencia));
    },
    [dispatch]
  );

  const handleEditOcorrencia = useCallback(
    (ocorrencia: Ocorrencia) => {
      return dispatch(updateOcorrenciaAsync(ocorrencia));
    },
    [dispatch]
  );

  const handleDeleteOcorrencia = useCallback(
    (id: number) => {
      return dispatch(deleteOcorrenciaAsync(id));
    },
    [dispatch]
  );

  // Ações síncronas

  const selectOcorrencia = useCallback(
    (ocorrencia: Ocorrencia | null) => {
      dispatch(setOcorrenciaSelecionada(ocorrencia));
    },
    [dispatch]
  );

  const clearOcorrenciaData = useCallback(() => {
    dispatch(clearOcorrencia());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectOcorrenciaById = (id: string) => {
    return ocorrencias.find((ot) => String(ot.id) === id);
  };

  return {
    // Estado
    ocorrencias,
    ocorrenciaSelecionada,
    loading,
    error,
    ocorrenciasFormatadas,
    ocorrenciasAtivas,

    // Ações assíncronas - Ocorrências
    fetchOcorrencias: handleFetchOcorrencias,
    createOcorrencia: handleCreateOcorrencia,
    editOcorrencia: handleEditOcorrencia,
    deleteOcorrencia: handleDeleteOcorrencia,

    // Ações síncronas
    selectOcorrencia,
    clearOcorrenciaData,
    clearError: resetError,
    selectOcorrenciaById,
  };
};
