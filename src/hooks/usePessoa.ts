import { RootState } from '@/store/rootReducer';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearError } from '@/store/slices/empresaCategoriaSlice';
import {
  CreatePessoaDto,
  clearCurrentPessoa,
  clearLogin,
  createPessoa,
  deletePessoa,
  fetchPessoaById,
  fetchPessoaLogada,
  fetchPessoas,
  fetchPessoasByEmpresa,
  fetchPessoasByTipo,
  selectCurrentPessoa,
  selectIsLoggedIn,
  selectPessoaError,
  selectPessoaInfo,
  selectPessoaLoading,
  selectPessoaLogada,
  selectPessoas,
  selectPessoasFormatadas,
  setPessoa,
  setPessoaLogada,
  updatePessoa,
  updatePessoaLocal,
} from '@/store/slices/pessoaSlice';
import { Pessoa } from '@/types/pessoa.type';

export const usePessoa = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();

  // Seletores
  const pessoas = useSelector(selectPessoas);
  const currentPessoa = useSelector(selectCurrentPessoa);
  const pessoaLogada = useSelector(selectPessoaLogada);
  const pessoaInfo = useSelector(selectPessoaInfo);
  const loading = useSelector(selectPessoaLoading);
  const error = useSelector(selectPessoaError);
  const pessoasFormatadas = useSelector(selectPessoasFormatadas);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // --- Async Actions ---
  const handleFetchPessoas = useCallback(async () => {
    try {
      return await dispatch(fetchPessoas()).unwrap();
    } catch (err) {
      console.error('Erro ao carregar pessoas:', err);
      throw err;
    }
  }, [dispatch]);

  const handleFetchPessoasByEmpresa = useCallback(
    async (empresaId: number) => {
      try {
        return await dispatch(fetchPessoasByEmpresa(empresaId)).unwrap();
      } catch (err) {
        console.error('Erro ao carregar pessoas da empresa:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleFetchPessoasByTipo = useCallback(
    async (tipoId: number) => {
      try {
        return await dispatch(fetchPessoasByTipo(tipoId)).unwrap();
      } catch (err) {
        console.error('Erro ao carregar pessoas do tipo:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleFetchPessoaById = useCallback(
    async (id: number) => {
      try {
        return await dispatch(fetchPessoaById(id)).unwrap();
      } catch (err) {
        console.error('Erro ao carregar pessoa por ID:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleCreatePessoa = useCallback(
    async (data: CreatePessoaDto) => {
      try {
        return await dispatch(createPessoa(data)).unwrap();
      } catch (err) {
        console.error('Erro ao criar pessoa:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleUpdatePessoa = useCallback(
    async ({ id, data }: { id: number; data: Partial<Pessoa> }) => {
      try {
        return await dispatch(updatePessoa({ id, data })).unwrap();
      } catch (err) {
        console.error('Erro ao atualizar pessoa:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleDeletePessoa = useCallback(
    async (id: number) => {
      try {
        return await dispatch(deletePessoa(id)).unwrap();
      } catch (err) {
        console.error('Erro ao excluir pessoa:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleFetchPessoaLogada = useCallback(
    async (pessoaId: string) => {
      try {
        return await dispatch(fetchPessoaLogada(pessoaId)).unwrap();
      } catch (err) {
        console.error('Erro ao carregar pessoa logada:', err);
        throw err;
      }
    },
    [dispatch]
  );

  // --- Sync Actions ---
  const handleSetPessoa = useCallback(
    (info: any) => {
      dispatch(setPessoa(info));
    },
    [dispatch]
  );

  const handleSetPessoaLogada = useCallback(
    (pessoa: Pessoa) => {
      dispatch(setPessoaLogada(pessoa));
    },
    [dispatch]
  );

  const handleClearCurrentPessoa = useCallback(() => {
    dispatch(clearCurrentPessoa());
  }, [dispatch]);

  const handleClearLogin = useCallback(() => {
    dispatch(clearLogin());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleUpdatePessoaLocal = useCallback(
    (pessoa: Pessoa) => {
      dispatch(updatePessoaLocal(pessoa));
    },
    [dispatch]
  );

  const selectPessoaById = (id: number) => {
    return pessoas.find((pessoa) => pessoa.id === id);
  };

  // --- Retorno do Hook ---
  return {
    // Estado
    pessoas,
    currentPessoa,
    pessoaLogada,
    pessoaInfo,
    pessoasFormatadas,
    loading,
    error,
    isLoggedIn,
    selectPessoaById,

    // Async Actions
    fetchPessoas: handleFetchPessoas,
    fetchPessoasByEmpresa: handleFetchPessoasByEmpresa,
    fetchPessoasByTipo: handleFetchPessoasByTipo,
    fetchPessoaById: handleFetchPessoaById,
    fetchPessoaLogada: handleFetchPessoaLogada,
    createPessoa: handleCreatePessoa,
    updatePessoa: handleUpdatePessoa,
    deletePessoa: handleDeletePessoa,

    // Sync Actions
    setPessoa: handleSetPessoa,
    setPessoaLogada: handleSetPessoaLogada,
    clearCurrentPessoa: handleClearCurrentPessoa,
    clearLogin: handleClearLogin,
    clearError: handleClearError,
    updatePessoaLocal: handleUpdatePessoaLocal,
  };
};
