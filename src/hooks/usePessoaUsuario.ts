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
  updatePessoaUsuario,
} from '@/store/slices/pessoaUsuarioSlice';
import { AppDispatch } from '@/store/store';
import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePessoaUsuario = () => {
  const dispatch = useDispatch<AppDispatch>();

  const pessoaUsuarios = useSelector(selectPessoaUsuarios);
  const currentPessoaUsuario = useSelector(selectCurrentPessoaUsuario);
  const loading = useSelector(selectPessoaUsuarioLoading);
  const error = useSelector(selectPessoaUsuarioError);

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

  return {
    // State
    pessoaUsuarios,
    currentPessoaUsuario,
    loading,
    error,

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
