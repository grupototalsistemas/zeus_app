import { RootState } from '@/store/rootReducer';
import {
  clearError,
  clearEtapaAtual,
  createEtapa,
  deleteEtapa,
  fetchEtapa,
  fetchEtapas,
  selectErrorEtapa,
  selectEtapaAtual,
  selectEtapas,
  selectEtapasAtivas,
  selectEtapasFormatadas,
  selectLoadingEtapa,
  updateEtapa,
} from '@/store/slices/etapaMovimento.slice';
import { ChamadoMovimentoEtapa } from '@/types/chamadoMovimentoEtapa.type';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEtapaMovimento = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();

  // Seletores
  const etapas = useSelector(selectEtapas);
  const etapasFormatadas = useSelector(selectEtapasFormatadas);
  const etapasAtivas = useSelector(selectEtapasAtivas);
  const etapaAtual = useSelector(selectEtapaAtual);
  const loading = useSelector(selectLoadingEtapa);
  const error = useSelector(selectErrorEtapa);

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
        return await dispatch(createEtapa(etapa)).unwrap();
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
        return await dispatch(updateEtapa({ id, data })).unwrap();
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
        return await dispatch(fetchEtapa(id)).unwrap();
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

  return {
    // Estado
    etapas,
    etapasFormatadas, // pronto para Select
    etapasAtivas,
    etapaAtual,
    loading,
    error,

    // Ações
    fetchEtapas: handleFetchEtapas,
    createEtapa: handleCreateEtapa,
    updateEtapa: handleEditEtapa,
    deleteEtapa: handleDeleteEtapa,
    fetchEtapaById: handleFetchEtapaById,
    clearEtapaAtual: handleClearEtapaAtual,
    clearError: handleClearError,
  };
};
