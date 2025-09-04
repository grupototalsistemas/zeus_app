import { OcorrenciaService } from '@/service/ocorrencia.service';
import {
  addOcorrencia,
  clearOcorrencia,
  removeOcorrencia,
  selectError,
  selectLoading,
  selectOcorrencias,
  selectOcorrenciasAtivas,
  selectOcorrenciaSelecionada,
  selectOcorrenciasFormatadas,
  setError,
  setLoading,
  setOcorrencias,
  setOcorrenciaSelecionada,
  updateOcorrencia,
} from '@/store/slices/ocorrenciaSlice';
import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useOcorrencia = () => {
  const dispatch = useDispatch();

  // Seletores

  const ocorrencias = useSelector(selectOcorrencias);
  const ocorrenciaSelecionada = useSelector(selectOcorrenciaSelecionada);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const ocorrenciasFormatadas = useSelector(selectOcorrenciasFormatadas);
  const ocorrenciasAtivas = useSelector(selectOcorrenciasAtivas);

  // Ações assíncronas para Ocorrências
  const fetchOcorrencias = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await OcorrenciaService.getOcorrencias();
      dispatch(setOcorrencias(response));
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      dispatch(setError('Erro ao carregar ocorrências'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createOcorrencia = useCallback(
    async (ocorrencia: Omit<Ocorrencia, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newOcorrencia =
          await OcorrenciaService.createOcorrencia(ocorrencia);
        dispatch(addOcorrencia(newOcorrencia));
        return newOcorrencia;
      } catch (error) {
        console.error('Erro ao criar ocorrência:', error);
        dispatch(setError('Erro ao criar ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const editOcorrencia = useCallback(
    async (ocorrencia: Ocorrencia) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedOcorrencia = await OcorrenciaService.updateOcorrencia(
          ocorrencia.id!,
          ocorrencia
        );
        dispatch(updateOcorrencia(updatedOcorrencia));
        return updatedOcorrencia;
      } catch (error) {
        console.error('Erro ao editar ocorrência:', error);
        dispatch(setError('Erro ao editar ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deleteOcorrencia = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await OcorrenciaService.deleteOcorrencia(id);
        dispatch(removeOcorrencia(id));
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        dispatch(setError('Erro ao excluir ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Ações síncronas

  const selectOcorrencia = useCallback(
    (ocorrencia: Ocorrencia | null) => {
      dispatch(setOcorrenciaSelecionada(ocorrencia));
    },
    [dispatch]
  );

  const clearOcorrenciaData = useCallback(() => {
    dispatch(clearOcorrencia());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectOcorrenciaById = (id: string) => {
    return ocorrencias.find((ot) => String(ot.id) === id);
  };

  return {
    // Estado
    ocorrencias,
    ocorrenciaSelecionada,
    loading,
    error,
    ocorrenciasFormatadas,
    ocorrenciasAtivas,

    // Ações assíncronas - Ocorrências
    fetchOcorrencias,
    createOcorrencia,
    editOcorrencia,
    deleteOcorrencia,

    // Ações síncronas
    selectOcorrencia,
    clearOcorrenciaData,
    clearError,
    selectOcorrenciaById,
  };
};
