import {
  clearCurrentMovimentoAnexo,
  clearError,
  createMovimentoAnexo,
  deleteMovimentoAnexo,
  downloadAnexo,
  fetchMovimentoAnexoById,
  fetchMovimentoAnexos,
  fetchMovimentoAnexosByMovimento,
  selectCurrentMovimentoAnexo,
  selectMovimentoAnexoError,
  selectMovimentoAnexoLoading,
  selectMovimentoAnexos,
  updateMovimentoAnexo,
  uploadAnexo,
} from '@/store/slices/movimentoAnexoSlice';
import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useMovimentoAnexo = () => {
  const dispatch = useAppDispatch();

  const movimentoAnexos = useAppSelector(selectMovimentoAnexos);
  const currentMovimentoAnexo = useAppSelector(selectCurrentMovimentoAnexo);
  const loading = useAppSelector(selectMovimentoAnexoLoading);
  const error = useAppSelector(selectMovimentoAnexoError);

  const getAll = useCallback(() => {
    return dispatch(fetchMovimentoAnexos());
  }, [dispatch]);

  const getByMovimento = useCallback(
    (movimentoId: number) => {
      return dispatch(fetchMovimentoAnexosByMovimento(movimentoId));
    },
    [dispatch]
  );

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchMovimentoAnexoById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: ChamadoMovimentoAnexo) => {
      return dispatch(createMovimentoAnexo(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: ChamadoMovimentoAnexo) => {
      return dispatch(updateMovimentoAnexo({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteMovimentoAnexo(id));
    },
    [dispatch]
  );

  const upload = useCallback(
    (file: File, movimentoId: number) => {
      return dispatch(uploadAnexo({ file, movimentoId }));
    },
    [dispatch]
  );

  const download = useCallback(
    (id: number) => {
      return dispatch(downloadAnexo(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentMovimentoAnexo());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    movimentoAnexos,
    currentMovimentoAnexo,
    loading,
    error,

    // Actions
    getAll,
    getByMovimento,
    getById,
    create,
    update,
    remove,
    upload,
    download,
    clearCurrent,
    resetError,
  };
};
