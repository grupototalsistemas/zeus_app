import {
  clearCurrentEmpresaSistema,
  clearError,
  createEmpresaSistema,
  deleteEmpresaSistema,
  fetchEmpresaSistemaByEmpresa,
  fetchEmpresaSistemaById,
  fetchEmpresaSistemas,
  selectCurrentEmpresaSistema,
  selectEmpresaSistemaError,
  selectEmpresaSistemaLoading,
  selectEmpresaSistemas,
  updateEmpresaSistema,
} from '@/store/slices/empresaSistemaSlice';
import { AppDispatch } from '@/store/store';
import { EmpresaSistema } from '@/types/empresaSistema.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEmpresaSistema = () => {
  const dispatch = useDispatch<AppDispatch>();

  const empresaSistemas = useSelector(selectEmpresaSistemas);
  const currentEmpresaSistema = useSelector(selectCurrentEmpresaSistema);
  const loading = useSelector(selectEmpresaSistemaLoading);
  const error = useSelector(selectEmpresaSistemaError);

  const getAll = useCallback(() => {
    return dispatch(fetchEmpresaSistemas());
  }, [dispatch]);

  const getByEmpresa = useCallback(
    (empresaId: number) => {
      return dispatch(fetchEmpresaSistemaByEmpresa(empresaId));
    },
    [dispatch]
  );

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchEmpresaSistemaById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: EmpresaSistema) => {
      return dispatch(createEmpresaSistema(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: EmpresaSistema) => {
      return dispatch(updateEmpresaSistema({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteEmpresaSistema(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentEmpresaSistema());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    empresaSistemas,
    currentEmpresaSistema,
    loading,
    error,

    // Actions
    getAll,
    getByEmpresa,
    getById,
    create,
    update,
    remove,
    clearCurrent,
    resetError,
  };
};
