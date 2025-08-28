import { OcorrenciaService } from '@/service/ocorrencia.service';
import {
  addOcorrencia,
  addOcorrenciaTipo,
  clearOcorrencia,
  removeOcorrencia,
  removeOcorrenciaTipo,
  selectError,
  selectLoading,
  selectOcorrencias,
  selectOcorrenciasAtivas,
  selectOcorrenciaSelecionada,
  selectOcorrenciasFormatadas,
  selectOcorrenciasTipos,
  selectOcorrenciasTiposAtivos,
  selectOcorrenciasTiposFormatados,
  selectOcorrenciaTipoSelecionado,
  setError,
  setLoading,
  setOcorrencias,
  setOcorrenciaSelecionada,
  setOcorrenciasTipos,
  setOcorrenciaTipoSelecionado,
  updateOcorrencia,
  updateOcorrenciaTipo,
} from '@/store/slices/ocorrenciaSlice';
import { Ocorrencia, OcorrenciaTipo } from '@/types/ocorrencia.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useOcorrencia = () => {
  const dispatch = useDispatch();

  // Seletores
  const ocorrenciasTipos = useSelector(selectOcorrenciasTipos);
  const ocorrencias = useSelector(selectOcorrencias);
  const ocorrenciaTipoSelecionado = useSelector(
    selectOcorrenciaTipoSelecionado
  );
  const ocorrenciaSelecionada = useSelector(selectOcorrenciaSelecionada);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const ocorrenciasTiposFormatados = useSelector(
    selectOcorrenciasTiposFormatados
  );
  const ocorrenciasTiposAtivos = useSelector(selectOcorrenciasTiposAtivos);
  const ocorrenciasFormatadas = useSelector(selectOcorrenciasFormatadas);
  const ocorrenciasAtivas = useSelector(selectOcorrenciasAtivas);

  // Ações assíncronas para Ocorrências Tipos
  const fetchOcorrenciasTipos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await OcorrenciaService.getOcorrenciasTipos();
      dispatch(setOcorrenciasTipos(response));
    } catch (error) {
      console.error('Erro ao buscar tipos de ocorrências:', error);
      dispatch(setError('Erro ao carregar tipos de ocorrências'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createOcorrenciaTipo = useCallback(
    async (ocorrenciaTipo: Omit<OcorrenciaTipo, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newOcorrenciaTipo =
          await OcorrenciaService.createOcorrenciaTipo(ocorrenciaTipo);
        dispatch(addOcorrenciaTipo(newOcorrenciaTipo));
        return newOcorrenciaTipo;
      } catch (error) {
        console.error('Erro ao criar tipo de ocorrência:', error);
        dispatch(setError('Erro ao criar tipo de ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const editOcorrenciaTipo = useCallback(
    async (ocorrenciaTipo: OcorrenciaTipo) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedOcorrenciaTipo =
          await OcorrenciaService.updateOcorrenciaTipo(
            ocorrenciaTipo.id!,
            ocorrenciaTipo
          );
        dispatch(updateOcorrenciaTipo(updatedOcorrenciaTipo));
        return updatedOcorrenciaTipo;
      } catch (error) {
        console.error('Erro ao editar tipo de ocorrência:', error);
        dispatch(setError('Erro ao editar tipo de ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deleteOcorrenciaTipo = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await OcorrenciaService.deleteOcorrenciaTipo(id);
        dispatch(removeOcorrenciaTipo(id));
      } catch (error) {
        console.error('Erro ao excluir tipo de ocorrência:', error);
        dispatch(setError('Erro ao excluir tipo de ocorrência'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

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
  const selectOcorrenciaTipo = useCallback(
    (ocorrenciaTipo: OcorrenciaTipo | null) => {
      dispatch(setOcorrenciaTipoSelecionado(ocorrenciaTipo));
    },
    [dispatch]
  );

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
  const selectOcorrenciaById = 
    (id: number) => {
      return ocorrencias.find((ot) => ot.id === id);
    }

  return {
    // Estado
    ocorrenciasTipos,
    ocorrencias,
    ocorrenciaTipoSelecionado,
    ocorrenciaSelecionada,
    loading,
    error,
    ocorrenciasTiposFormatados,
    ocorrenciasTiposAtivos,
    ocorrenciasFormatadas,
    ocorrenciasAtivas,

    // Ações assíncronas - Tipos
    fetchOcorrenciasTipos,
    createOcorrenciaTipo,
    editOcorrenciaTipo,
    deleteOcorrenciaTipo,

    // Ações assíncronas - Ocorrências
    fetchOcorrencias,
    createOcorrencia,
    editOcorrencia,
    deleteOcorrencia,

    // Ações síncronas
    selectOcorrenciaTipo,
    selectOcorrencia,
    clearOcorrenciaData,
    clearError,
    selectOcorrenciaById
  };
};
