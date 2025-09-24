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
import { unwrapResult } from '@reduxjs/toolkit';
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

  // Formatação dos sistemas em value e label para select
  const getByEmpresaFormatados = useCallback(
    async (empresaId: string) => {
      // dispara a action para buscar os sistemas dessa empresa
      const resultAction = await dispatch(
        fetchEmpresaSistemaByEmpresa(Number(empresaId))
      );

      // unwrapResult para pegar payload direto se quiser tratar erro
      const data = unwrapResult(resultAction);

      // como o payload vem no resultAction.payload

      if (!data) return [];

      // transforma em { value, label }
      return data.map((es) => ({
        value: es.sistema.id, // ou es.id, depende de qual você quer no select
        label: es.sistema.nome, // nome do sistema
      }));
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
