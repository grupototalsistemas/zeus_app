import {
  clearError,
  clearPessoaTipo,
  createPessoaTipo,
  deletePessoaTipoAsync,
  fetchPessoasTipos,
  fetchPessoaTipoById,
  selectError,
  selectLoading,
  selectPessoasTipos,
  selectPessoasTiposAtivos,
  selectPessoasTiposFormatados,
  selectPessoaTipoSelecionado,
  setPessoaTipoSelecionado,
  updatePessoaTipoAsync,
} from '@/store/slices/pessoaTipoSlice';
import { PessoaTipo } from '@/types/pessoaTipo.type';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const usePessoaTipo = () => {
  const dispatch = useAppDispatch();

  // Seletores
  const pessoasTipos = useAppSelector(selectPessoasTipos);
  const pessoasTiposSelecionado = useAppSelector(selectPessoaTipoSelecionado);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const pessoasTiposFormatados = useAppSelector(selectPessoasTiposFormatados);
  const pessoasTipoAtivos = useAppSelector(selectPessoasTiposAtivos);

  // Ações assíncronas
  const handleFetchPessoasTipos = useCallback(() => {
    return dispatch(fetchPessoasTipos());
  }, [dispatch]);

  const handleCreatePessoaTipo = useCallback(
    (tipo: Omit<PessoaTipo, 'id'>) => {
      return dispatch(createPessoaTipo(tipo));
    },
    [dispatch]
  );

  const handleEditPessoaTipo = useCallback(
    (tipo: PessoaTipo) => {
      return dispatch(updatePessoaTipoAsync(tipo));
    },
    [dispatch]
  );

  const handleDeletePessoaTipo = useCallback(
    (id: number) => {
      return dispatch(deletePessoaTipoAsync(id));
    },
    [dispatch]
  );

  const handleFetchPessoaTipoById = useCallback(
    (id: number) => {
      return dispatch(fetchPessoaTipoById(id));
    },
    [dispatch]
  );

  // Ações síncronas
  const selectPessoaTipo = useCallback(
    (tipo: PessoaTipo | null) => {
      dispatch(setPessoaTipoSelecionado(tipo));
    },
    [dispatch]
  );

  const clearPessoaTipoData = useCallback(() => {
    dispatch(clearPessoaTipo());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectTipoById = (id: number) => {
    return pessoasTipos.find((t) => t.id === id);
  };

  return {
    // Estado
    pessoasTipos,
    pessoasTiposSelecionado,
    loading,
    error,
    pessoasTiposFormatados,
    pessoasTipoAtivos,

    // Ações assíncronas
    fetchPessoasTipos: handleFetchPessoasTipos,
    createPessoaTipo: handleCreatePessoaTipo,
    editPessoaTipo: handleEditPessoaTipo,
    deletePessoaTipo: handleDeletePessoaTipo,
    fetchPessoaTipoById: handleFetchPessoaTipoById,

    // Ações síncronas
    selectPessoaTipo,
    clearError: resetError,
    selectTipoById,
  };
};
