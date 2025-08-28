import { TipoService } from '@/service/tipo.service';
import {
  addTipo,
  clearTipo,
  removeTipo,
  selectError,
  selectLoading,
  selectTipoSelecionado,
  selectTipos,
  selectTiposAtivos,
  selectTiposFormatados,
  setError,
  setLoading,
  setTipoSelecionado,
  setTipos,
  updateTipo,
} from '@/store/slices/tipoSlice';
import { Tipo } from '@/types/tipo.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useTipo = () => {
  const dispatch = useDispatch();

  // Seletores
  const tipos = useSelector(selectTipos);
  const tipoSelecionado = useSelector(selectTipoSelecionado);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const tiposFormatados = useSelector(selectTiposFormatados);
  const tiposAtivos = useSelector(selectTiposAtivos);

  // Ações assíncronas
  const fetchTipos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await TipoService.getTipos();
      dispatch(setTipos(response));
    } catch (error) {
      console.error('Erro ao buscar tipos:', error);
      dispatch(setError('Erro ao carregar tipos'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createTipo = useCallback(
    async (tipo: Omit<Tipo, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newTipo = await TipoService.createTipo(tipo);
        dispatch(addTipo(newTipo));
        return newTipo;
      } catch (error) {
        console.error('Erro ao criar tipo:', error);
        dispatch(setError('Erro ao criar tipo'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const editTipo = useCallback(
    async (tipo: Tipo) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedTipo = await TipoService.updateTipo(tipo.id!, tipo);
        dispatch(updateTipo(updatedTipo));
        return updatedTipo;
      } catch (error) {
        console.error('Erro ao editar tipo:', error);
        dispatch(setError('Erro ao editar tipo'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deleteTipo = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await TipoService.deleteTipo(id);
        dispatch(removeTipo(id));
      } catch (error) {
        console.error('Erro ao excluir tipo:', error);
        dispatch(setError('Erro ao excluir tipo'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchTipoById = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const tipo = await TipoService.getTipo(id);
        dispatch(setTipoSelecionado(tipo));
        return tipo;
      } catch (error) {
        console.error('Erro ao buscar tipo por ID:', error);
        dispatch(setError('Erro ao buscar tipo'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Ações síncronas
  const selectTipo = useCallback(
    (tipo: Tipo | null) => {
      dispatch(setTipoSelecionado(tipo));
    },
    [dispatch]
  );

  const clearTipoData = useCallback(() => {
    dispatch(clearTipo());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectTipoById = 
    (id: number) => {
      return tipos.find((t) => t.id === id); 
    }
    
  
  return {
    // Estado
    tipos,
    tipoSelecionado,
    loading,
    error,
    tiposFormatados,
    tiposAtivos,

    // Ações assíncronas
    fetchTipos,
    createTipo,
    editTipo,
    deleteTipo,
    fetchTipoById,

    // Ações síncronas
    selectTipo,
    clearTipoData,
    clearError,
    selectTipoById
  };
};
