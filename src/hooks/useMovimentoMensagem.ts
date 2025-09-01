import {
  clearCurrentMovimentoMensagem,
  clearError,
  createMovimentoMensagem,
  deleteMovimentoMensagem,
  fetchMovimentoMensagemById,
  fetchMovimentoMensagens,
  fetchMovimentoMensagensByMovimento,
  selectCurrentMovimentoMensagem,
  selectMovimentoMensagemError,
  selectMovimentoMensagemLoading,
  selectMovimentoMensagens,
  updateMovimentoMensagem,
} from '@/store/slices/movimentoMensagemSlice';
import { AppDispatch } from '@/store/store';
import { ChamadoMovimentoMensagem } from '@/types/chamadoMovimentoMensagem.type';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useMovimentoMensagem = () => {
  const dispatch = useDispatch<AppDispatch>();

  const movimentoMensagens = useSelector(selectMovimentoMensagens);
  const currentMovimentoMensagem = useSelector(selectCurrentMovimentoMensagem);
  const loading = useSelector(selectMovimentoMensagemLoading);
  const error = useSelector(selectMovimentoMensagemError);

  const getAll = useCallback(() => {
    return dispatch(fetchMovimentoMensagens());
  }, [dispatch]);

  const getByMovimento = useCallback(
    (movimentoId: number) => {
      return dispatch(fetchMovimentoMensagensByMovimento(movimentoId));
    },
    [dispatch]
  );

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchMovimentoMensagemById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: ChamadoMovimentoMensagem) => {
      return dispatch(createMovimentoMensagem(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: ChamadoMovimentoMensagem) => {
      return dispatch(updateMovimentoMensagem({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteMovimentoMensagem(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentMovimentoMensagem());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    movimentoMensagens,
    currentMovimentoMensagem,
    loading,
    error,

    // Actions
    getAll,
    getByMovimento,
    getById,
    create,
    update,
    remove,
    clearCurrent,
    resetError,
  };
};
