import {
  clearError,
  clearPrioridade,
  createPrioridade,
  deletePrioridadeAsync,
  fetchPrioridadeById,
  fetchPrioridades,
  selectError,
  selectLoading,
  selectPrioridades,
  selectPrioridadesAtivas,
  selectPrioridadeSelecionada,
  selectPrioridadesFormatadas,
  setPrioridadeSelecionada,
  updatePrioridadeAsync,
} from '@/store/slices/prioridadeSlice';
import { Prioridade } from '@/types/chamadoPrioridade.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const usePrioridade = () => {
  const dispatch = useAppDispatch();

  // Seletores
  const prioridades = useAppSelector(selectPrioridades);
  const prioridadeSelecionada = useAppSelector(selectPrioridadeSelecionada);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const prioridadesFormatadas = useAppSelector(selectPrioridadesFormatadas);
  const prioridadesAtivas = useAppSelector(selectPrioridadesAtivas);

  // Ações assíncronas
  const handleFetchPrioridades = useCallback(() => {
    return dispatch(fetchPrioridades());
  }, [dispatch]);

  const handleCreatePrioridade = useCallback(
    (prioridade: Omit<Prioridade, 'id'>) => {
      return dispatch(createPrioridade(prioridade));
    },
    [dispatch]
  );

  const handleEditPrioridade = useCallback(
    (prioridade: Prioridade) => {
      return dispatch(updatePrioridadeAsync(prioridade));
    },
    [dispatch]
  );

  const handleDeletePrioridade = useCallback(
    (id: number) => {
      return dispatch(deletePrioridadeAsync(id));
    },
    [dispatch]
  );

  const handleFetchPrioridadeById = useCallback(
    (id: number) => {
      return dispatch(fetchPrioridadeById(id));
    },
    [dispatch]
  );

  // Ações síncronas
  const selectPrioridade = useCallback(
    (prioridade: Prioridade | null) => {
      dispatch(setPrioridadeSelecionada(prioridade));
    },
    [dispatch]
  );

  const clearPrioridadeData = useCallback(() => {
    dispatch(clearPrioridade());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Selecionar por Id
  const selectPrioridadeById = (id: string) => {
    return prioridades.find((p) => String(p.id) === id);
  };

  return {
    // Estado
    prioridades,
    prioridadeSelecionada,
    loading,
    error,
    prioridadesFormatadas,
    prioridadesAtivas,

    // Ações assíncronas
    fetchPrioridades: handleFetchPrioridades,
    createPrioridade: handleCreatePrioridade,
    editPrioridade: handleEditPrioridade,
    deletePrioridade: handleDeletePrioridade,
    fetchPrioridadeById: handleFetchPrioridadeById,

    // Ações síncronas
    selectPrioridade,
    clearPrioridadeData,
    clearError: resetError,
    selectPrioridadeById,
  };
};
