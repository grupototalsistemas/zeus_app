import {
  clearError,
  clearEtapaAtual,
  createEtapa,
  deleteEtapa,
  fetchEtapa,
  fetchEtapas,
  updateEtapa,
} from '@/store/slices/etapaMovimento.slice';
import { ChamadoMovimentoEtapa } from '@/types/chamadoMovimentoEtapa.type';

import { RootState } from '@/store/rootReducer';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEtapaMovimento = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();

  // Seletores do estado do Redux
  const { etapas, etapaAtual, loading, error } = useSelector(
    (state: RootState) => state.chamado_etapa_movimento
  );

  // Ações assíncronas
  const handleFetchEtapas = useCallback(async () => {
    try {
      await dispatch(fetchEtapas()).unwrap();
    } catch (error) {
      console.error('Erro ao buscar etapas:', error);
    }
  }, [dispatch]);

  const handleCreateEtapa = useCallback(
    async (etapa: Partial<ChamadoMovimentoEtapa>) => {
      try {
        const result = await dispatch(createEtapa(etapa)).unwrap();
        return result;
      } catch (error) {
        console.error('Erro ao criar etapa:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleEditEtapa = useCallback(
    async (id: number, data: Partial<ChamadoMovimentoEtapa>) => {
      try {
        const result = await dispatch(updateEtapa({ id, data })).unwrap();
        return result;
      } catch (error) {
        console.error('Erro ao editar etapa:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleDeleteEtapa = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteEtapa(id)).unwrap();
      } catch (error) {
        console.error('Erro ao excluir etapa:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleFetchEtapaById = useCallback(
    async (id: number) => {
      try {
        const result = await dispatch(fetchEtapa(id)).unwrap();
        return result;
      } catch (error) {
        console.error('Erro ao buscar etapa por ID:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Ações síncronas
  const handleClearEtapaAtual = useCallback(() => {
    dispatch(clearEtapaAtual());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectEtapaById = (id: number) => {
    return etapas.find((e: ChamadoMovimentoEtapa) => e.id === id);
  };

  return {
    // Estado
    etapas,
    etapaAtual,
    loading,
    error,

    // Ações assíncronas
    fetchEtapas: handleFetchEtapas,
    createEtapa: handleCreateEtapa,
    updateEtapa: handleEditEtapa,
    deleteEtapa: handleDeleteEtapa,
    fetchEtapaById: handleFetchEtapaById,

    // Ações síncronas
    clearEtapaAtual: handleClearEtapaAtual,
    clearError: handleClearError,
    selectEtapaById,
  };
};
