import {
  clearCurrentSistema,
  clearError,
  createSistema,
  deleteSistema,
  fetchSistemaById,
  fetchSistemas,
  selectCurrentSistema,
  selectSistemaError,
  selectSistemaLoading,
  selectSistemas,
  updateSistema,
} from '@/store/slices/sistemaSlice';
import { AppDispatch } from '@/store/store';
import { Sistema } from '@/types/sistema.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSistema = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sistemas = useSelector(selectSistemas);
  const currentSistema = useSelector(selectCurrentSistema);
  const loading = useSelector(selectSistemaLoading);
  const error = useSelector(selectSistemaError);

  const getAll = useCallback(() => {
    return dispatch(fetchSistemas());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchSistemaById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: Sistema) => {
      return dispatch(createSistema(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: Sistema) => {
      return dispatch(updateSistema({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteSistema(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentSistema());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    sistemas,
    currentSistema,
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
