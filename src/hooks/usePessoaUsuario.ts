import {
  clearCurrentPessoaUsuario,
  clearError,
  createPessoaUsuario,
  deletePessoaUsuario,
  fetchPessoaUsuarioById,
  fetchPessoaUsuarioByPessoa,
  fetchPessoaUsuarios,
  selectCurrentPessoaUsuario,
  selectPessoaUsuarioError,
  selectPessoaUsuarioLoading,
  selectPessoaUsuarios,
  selectPessoaUsuariosFormatados,
  updatePessoaUsuario,
} from '@/store/slices/pessoaUsuarioSlice';
import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';

export const usePessoaUsuario = () => {
  const dispatch = useAppDispatch();

  const pessoaUsuarios = useAppSelector(selectPessoaUsuarios);
  const currentPessoaUsuario = useAppSelector(selectCurrentPessoaUsuario);
  const loading = useAppSelector(selectPessoaUsuarioLoading);
  const selectUsuarioFormatados = useAppSelector(
    selectPessoaUsuariosFormatados
  );
  const error = useAppSelector(selectPessoaUsuarioError);

  const getAll = useCallback(() => {
    return dispatch(fetchPessoaUsuarios());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchPessoaUsuarioById(id));
    },
    [dispatch]
  );

  const getByPessoa = useCallback(
    (pessoaId: number) => {
      return dispatch(fetchPessoaUsuarioByPessoa(pessoaId));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: PessoaUsuario) => {
      return dispatch(createPessoaUsuario(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: PessoaUsuario) => {
      return dispatch(updatePessoaUsuario({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deletePessoaUsuario(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentPessoaUsuario());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  const selectUsuarioById = useCallback(
    (id: number) => {
      return pessoaUsuarios.find((pessoaUsuario) => pessoaUsuario.id === id);
    },
    [pessoaUsuarios]
  );

  return {
    // State
    pessoaUsuarios,
    currentPessoaUsuario,
    loading,
    error,

    selectUsuarioFormatados,
    selectUsuarioById,
    // Actions
    getAll,
    getById,
    getByPessoa,
    create,
    update,
    remove,
    clearCurrent,
    resetError,
  };
};
