import {
  clearEmpresa,
  clearError,
  createEmpresas,
  deleteEmpresas,
  fetchEmpresas,
  fetchEmpresasById,
  selectEmpresa,
  selectEmpresaError,
  selectEmpresaLoading,
  selectEmpresas,
  updateEmpresas,
} from '@/store/slices/empresaSlice';
import { selectPessoaInfo } from '@/store/slices/pessoaSlice';
import { AppDispatch } from '@/store/store';
import { Empresa } from '@/types/empresa.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEmpresa = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pessoaInfo = useSelector(selectPessoaInfo);

  const empresas = useSelector(selectEmpresas);
  const empresa = useSelector(selectEmpresa);
  const loading = useSelector(selectEmpresaLoading);
  const error = useSelector(selectEmpresaError);

  const getAllEmpresas = useCallback(() => {
    return dispatch(
      fetchEmpresas({
        id_pessoa_juridica_empresa: Number(pessoaInfo?.id_pessoa_juridica),
      })
    );
  }, [dispatch, pessoaInfo]);

  const getEmpresaById = useCallback(
    (id: number) => {
      return dispatch(fetchEmpresasById(id));
    },
    [dispatch]
  );

  const createEmpresa = useCallback(
    (data: Empresa) => {
      return dispatch(createEmpresas(data));
    },
    [dispatch]
  );

  const updateEmpresa = useCallback(
    (id: number, data: Empresa) => {
      return dispatch(updateEmpresas({ id, data }));
    },
    [dispatch]
  );

  const removeEmpresa = useCallback(
    (id: number) => {
      return dispatch(deleteEmpresas(id));
    },
    [dispatch]
  );

  const clearCurrentEmpresa = useCallback(() => {
    return dispatch(clearEmpresa());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  const findById = useCallback(
    (id: number) => {
      return empresas.find((empresa) => empresa.id === id);
    },
    [empresas]
  );

  return {
    // State
    empresas,
    empresa,
    loading,
    error,

    findById,

    // Actions
    getAllEmpresas,
    getEmpresaById,
    createEmpresa,
    updateEmpresa,
    removeEmpresa,
    clearEmpresa: clearCurrentEmpresa,
    resetError,
  };
};
