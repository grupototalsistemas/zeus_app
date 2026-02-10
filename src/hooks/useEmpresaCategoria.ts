import {
  clearCurrentEmpresaCategoria,
  clearError,
  createEmpresaCategoria,
  deleteEmpresaCategoria,
  fetchEmpresaCategoriaById,
  fetchEmpresaCategorias,
  selectCurrentEmpresaCategoria,
  selectEmpresaCategoriaError,
  selectEmpresaCategoriaLoading,
  selectEmpresaCategorias,
  updateEmpresaCategoria,
} from '@/store/slices/empresaCategoriaSlice';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useEmpresaCategoria = () => {
  const dispatch = useAppDispatch();

  const empresaCategorias = useAppSelector(selectEmpresaCategorias);
  const currentEmpresaCategoria = useAppSelector(selectCurrentEmpresaCategoria);
  const loading = useAppSelector(selectEmpresaCategoriaLoading);
  const error = useAppSelector(selectEmpresaCategoriaError);

  const getAll = useCallback(() => {
    return dispatch(fetchEmpresaCategorias());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchEmpresaCategoriaById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: EmpresaCategoria) => {
      return dispatch(createEmpresaCategoria(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: EmpresaCategoria) => {
      return dispatch(updateEmpresaCategoria({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteEmpresaCategoria(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentEmpresaCategoria());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    empresaCategorias,
    currentEmpresaCategoria,
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
