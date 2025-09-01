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
import { AppDispatch } from '@/store/store';
import { ChamadoMovimentoAnexo } from '@/types/chamadoMovimentoAnexo.type';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useMovimentoAnexo = () => {
  const dispatch = useDispatch<AppDispatch>();

  const movimentoAnexos = useSelector(selectMovimentoAnexos);
  const currentMovimentoAnexo = useSelector(selectCurrentMovimentoAnexo);
  const loading = useSelector(selectMovimentoAnexoLoading);
  const error = useSelector(selectMovimentoAnexoError);

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
