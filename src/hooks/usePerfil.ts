import {
  clearError,
  clearPerfil,
  createPerfil,
  deletePerfilAsync,
  fetchPerfilById,
  fetchPerfis,
  selectError,
  selectLoading,
  selectPerfilSelecionado,
  selectPerfis,
  selectPerfisFormatados,
  setPerfilSelecionado,
  updatePerfilAsync,
} from '@/store/slices/perfilSlice';
import { Perfil } from '@/types/pessoaPerfil.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const usePerfil = () => {
  const dispatch = useAppDispatch();

  // Seletores
  const perfis = useAppSelector(selectPerfis);

  const perfilSelecionado = useAppSelector(selectPerfilSelecionado);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const perfisFormatados = useAppSelector(selectPerfisFormatados);

  // Ações assíncronas
  const handleFetchPerfis = useCallback(() => {
    return dispatch(fetchPerfis());
  }, [dispatch]);

  const handleCreatePerfil = useCallback(
    (perfil: Omit<Perfil, 'id'>) => {
      return dispatch(createPerfil(perfil));
    },
    [dispatch]
  );

  const handleEditPerfil = useCallback(
    (perfil: Perfil) => {
      return dispatch(updatePerfilAsync(perfil));
    },
    [dispatch]
  );

  const handleDeletePerfil = useCallback(
    (id: number) => {
      return dispatch(deletePerfilAsync(id));
    },
    [dispatch]
  );

  const handleFetchPerfilById = useCallback(
    (id: number) => {
      return dispatch(fetchPerfilById(id));
    },
    [dispatch]
  );

  // Ações síncronas
  const selectPerfil = useCallback(
    (perfil: Perfil | null) => {
      dispatch(setPerfilSelecionado(perfil));
    },
    [dispatch]
  );

  const clearPerfilData = useCallback(() => {
    dispatch(clearPerfil());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // selecionar por Id
  const selectPerfilById = (id: number) => {
    return perfis.find((p) => p.id === id);
  };

  return {
    // Estado
    perfis,
    perfilSelecionado,
    loading,
    error,
    perfisFormatados,

    // Ações assíncronas
    fetchPerfis: handleFetchPerfis,
    createPerfil: handleCreatePerfil,
    editPerfil: handleEditPerfil,
    deletePerfil: handleDeletePerfil,
    fetchPerfilById: handleFetchPerfilById,

    // Ações síncronas
    selectPerfil,
    clearPerfilData,
    clearError: resetError,
    selectPerfilById,
  };
};
