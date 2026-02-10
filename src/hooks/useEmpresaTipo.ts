import {
  clearCurrentEmpresaTipo,
  clearError,
  createEmpresaTipo,
  deleteEmpresaTipo,
  fetchEmpresaTipoById,
  fetchEmpresaTipos,
  selectCurrentEmpresaTipo,
  selectEmpresaTipoError,
  selectEmpresaTipoLoading,
  selectEmpresaTipos,
  updateEmpresaTipo,
} from '@/store/slices/empresaTipoSlice';
import { EmpresaTipo } from '@/types/empresaTipo.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useEmpresaTipo = () => {
  const dispatch = useAppDispatch();

  const empresaTipos = useAppSelector(selectEmpresaTipos);
  const currentEmpresaTipo = useAppSelector(selectCurrentEmpresaTipo);
  const loading = useAppSelector(selectEmpresaTipoLoading);
  const error = useAppSelector(selectEmpresaTipoError);

  const getAll = useCallback(() => {
    return dispatch(fetchEmpresaTipos());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchEmpresaTipoById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: EmpresaTipo) => {
      return dispatch(createEmpresaTipo(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: EmpresaTipo) => {
      return dispatch(updateEmpresaTipo({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteEmpresaTipo(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentEmpresaTipo());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    empresaTipos,
    currentEmpresaTipo,
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
