import { PrioridadeService } from '@/service/prioridade.service';
import {
  addPrioridade,
  clearPrioridade,
  removePrioridade,
  selectError,
  selectLoading,
  selectPrioridades,
  selectPrioridadesAtivas,
  selectPrioridadeSelecionada,
  selectPrioridadesFormatadas,
  setError,
  setLoading,
  setPrioridades,
  setPrioridadeSelecionada,
  updatePrioridade,
} from '@/store/slices/prioridadeSlice';
import { Prioridade } from '@/types/prioridade.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePrioridade = () => {
  const dispatch = useDispatch();

  // Seletores
  const prioridades = useSelector(selectPrioridades);
  const prioridadeSelecionada = useSelector(selectPrioridadeSelecionada);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const prioridadesFormatadas = useSelector(selectPrioridadesFormatadas);
  const prioridadesAtivas = useSelector(selectPrioridadesAtivas);

  // Ações assíncronas
  const fetchPrioridades = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await PrioridadeService.getPrioridades();
      dispatch(setPrioridades(response));
    } catch (error) {
      console.error('Erro ao buscar prioridades:', error);
      dispatch(setError('Erro ao carregar prioridades'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createPrioridade = useCallback(
    async (prioridade: Omit<Prioridade, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newPrioridade =
          await PrioridadeService.createPrioridade(prioridade);
        dispatch(addPrioridade(newPrioridade));
        return newPrioridade;
      } catch (error) {
        console.error('Erro ao criar prioridade:', error);
        dispatch(setError('Erro ao criar prioridade'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const editPrioridade = useCallback(
    async (prioridade: Prioridade) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedPrioridade = await PrioridadeService.updatePrioridade(
          prioridade.id!,
          prioridade
        );
        dispatch(updatePrioridade(updatedPrioridade));
        return updatedPrioridade;
      } catch (error) {
        console.error('Erro ao editar prioridade:', error);
        dispatch(setError('Erro ao editar prioridade'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deletePrioridade = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await PrioridadeService.deletePrioridade(id);
        dispatch(removePrioridade(id));
      } catch (error) {
        console.error('Erro ao excluir prioridade:', error);
        dispatch(setError('Erro ao excluir prioridade'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchPrioridadeById = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const prioridade = await PrioridadeService.getPrioridade(id);
        dispatch(setPrioridadeSelecionada(prioridade));
        return prioridade;
      } catch (error) {
        console.error('Erro ao buscar prioridade por ID:', error);
        dispatch(setError('Erro ao buscar prioridade'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Ações síncronas
  const selectPrioridade = useCallback(
    (prioridade: Prioridade | null) => {
      dispatch(setPrioridadeSelecionada(prioridade));
    },
    [dispatch]
  );

  const clearPrioridadeData = useCallback(() => {
    dispatch(clearPrioridade());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // Estado
    prioridades,
    prioridadeSelecionada,
    loading,
    error,
    prioridadesFormatadas,
    prioridadesAtivas,

    // Ações assíncronas
    fetchPrioridades,
    createPrioridade,
    editPrioridade,
    deletePrioridade,
    fetchPrioridadeById,

    // Ações síncronas
    selectPrioridade,
    clearPrioridadeData,
    clearError,
  };
};
