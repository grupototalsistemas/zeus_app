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
import { EmpresaSistema } from '@/types/empresaSistema.type';
import { unwrapResult } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const useEmpresaSistema = () => {
  const dispatch = useAppDispatch();

  const empresaSistemas = useAppSelector(selectEmpresaSistemas);
  const currentEmpresaSistema = useAppSelector(selectCurrentEmpresaSistema);
  const loading = useAppSelector(selectEmpresaSistemaLoading);
  const error = useAppSelector(selectEmpresaSistemaError);

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

  // Formatacao dos sistemas em value e label para select
  const getByEmpresaFormatados = useCallback(
    async (empresaId: string) => {
      const resultAction = await dispatch(
        fetchEmpresaSistemaByEmpresa(Number(empresaId))
      );
      const data = unwrapResult(resultAction);

      if (!data) return [];

      return data
        .map((es) => ({
          value: es.sistema?.id?.toString?.() || '',
          label:
            es.sistema?.nome ||
            es.sistema?.sistema ||
            es.sistema?.descricao ||
            'Sistema sem nome',
        }))
        .filter((item) => item.value !== '');
    },
    [dispatch]
  );

  return {
    // State
    empresaSistemas,
    currentEmpresaSistema,
    loading,
    error,
    getByEmpresaFormatados,

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
