import {
  clearCurrentMovimento,
  clearError,
  createMovimento,
  deleteMovimento,
  fetchMovimentoById,
  fetchMovimentos,
  fetchMovimentosByChamado,
  selectCurrentMovimento,
  selectMovimentoError,
  selectMovimentoLoading,
  selectMovimentos,
  updateMovimento,
} from '@/store/slices/movimentoSlice';
import { ChamadoMovimento } from '@/types/chamadoMovimento.type';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useMovimento = () => {
  const dispatch = useAppDispatch();

  const movimentos = useAppSelector(selectMovimentos);
  const currentMovimento = useAppSelector(selectCurrentMovimento);
  const loading = useAppSelector(selectMovimentoLoading);
  const error = useAppSelector(selectMovimentoError);

  const getAll = useCallback(() => {
    return dispatch(fetchMovimentos());
  }, [dispatch]);

  const getByChamado = useCallback(
    (chamadoId: number) => {
      return dispatch(fetchMovimentosByChamado(chamadoId));
    },
    [dispatch]
  );

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchMovimentoById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: ChamadoMovimento) => {
      return dispatch(createMovimento(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: ChamadoMovimento) => {
      return dispatch(updateMovimento({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteMovimento(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentMovimento());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    movimentos,
    currentMovimento,
    loading,
    error,

    // Actions
    getAll,
    getByChamado,
    getById,
    create,
    update,
    remove,
    clearCurrent,
    resetError,
  };
};
