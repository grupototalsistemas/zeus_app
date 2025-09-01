import {
  clearCurrentChamado,
  clearError,
  createChamado,
  deleteChamado,
  fetchChamadoById,
  fetchChamados,
  selectChamadoError,
  selectChamadoLoading,
  selectChamados,
  selectCurrentChamado,
  updateChamado,
} from '@/store/slices/chamadoSlice';
import { AppDispatch } from '@/store/store';
import { Chamado, CreateChamadoDto } from '@/types/chamado.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useChamado = () => {
  const dispatch = useDispatch<AppDispatch>();

  const chamados = useSelector(selectChamados);
  const currentChamado = useSelector(selectCurrentChamado);
  const loading = useSelector(selectChamadoLoading);
  const error = useSelector(selectChamadoError);

  const getAll = useCallback(() => {
    return dispatch(fetchChamados());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchChamadoById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: CreateChamadoDto) => {
      return dispatch(createChamado(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: Chamado) => {
      return dispatch(updateChamado({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteChamado(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentChamado());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    chamados,
    currentChamado,
    loading,
    error,

    // Actions
    getAll,
    getById,
    create,
    update,
    remove,
    clearCurrent,
    resetError,
  };
};
