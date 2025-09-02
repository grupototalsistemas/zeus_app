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
import { AppDispatch } from '@/store/store';
import { ChamadoMovimento } from '@/types/chamadoMovimento.type';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useMovimento = () => {
  const dispatch = useDispatch<AppDispatch>();

  const movimentos = useSelector(selectMovimentos);
  const currentMovimento = useSelector(selectCurrentMovimento);
  const loading = useSelector(selectMovimentoLoading);
  const error = useSelector(selectMovimentoError);

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
