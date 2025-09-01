import { PessoaTipoService } from '@/service/pessoaTipo.service';
import {
  addPessoaTipo,
  clearPessoaTipo,
  removePessoaTipo,
  selectError,
  selectLoading,
  selectPessoasTipos,
  selectPessoasTiposAtivos,
  selectPessoasTiposFormatados,
  selectPessoaTipoSelecionado,
  setError,
  setLoading,
  setPessoasTipos,
  setPessoaTipoSelecionado,
  updatePessoaTipo,
} from '@/store/slices/pessoaTipoSlice';
import { PessoaTipo } from '@/types/pessoaTipo.type';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePessoaTipo = () => {
  const dispatch = useDispatch();

  // Seletores
  const pessoasTipos = useSelector(selectPessoasTipos);
  const pessoasTiposSelecionado = useSelector(selectPessoaTipoSelecionado);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pessoasTiposFormatados = useSelector(selectPessoasTiposFormatados);
  const pessoasTipoAtivos = useSelector(selectPessoasTiposAtivos);

  // Ações assíncronas
  const fetchPessoasTipos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await PessoaTipoService.getPessoasTipos();
      console.log('PessoasTipos buscados:', response);
      dispatch(setPessoasTipos(response));
    } catch (error) {
      console.error('Erro ao buscar pessoasTipos:', error);
      dispatch(setError('Erro ao carregar pessoasTipos'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createPessoaTipo = useCallback(
    async (tipo: Omit<PessoaTipo, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newTipo = await PessoaTipoService.createPessoaTipo(tipo);
        dispatch(addPessoaTipo(newTipo));
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

  const editPessoaTipo = useCallback(
    async (tipo: PessoaTipo) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedTipo = await PessoaTipoService.updatePessoaTipo(
          tipo.id!,
          tipo
        );
        dispatch(updatePessoaTipo(updatedTipo));
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

  const deletePessoaTipo = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await PessoaTipoService.deletePessoaTipo(id);
        dispatch(removePessoaTipo(id));
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

  const fetchPessoaTipoById = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const tipo = await PessoaTipoService.getPessoaTipo(id);
        dispatch(setPessoaTipoSelecionado(tipo));
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
  const selectPessoaTipo = useCallback(
    (tipo: PessoaTipo | null) => {
      dispatch(setPessoaTipoSelecionado(tipo));
    },
    [dispatch]
  );

  const clearPessoaTipoData = useCallback(() => {
    dispatch(clearPessoaTipo());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Selecionar por Id e mostrar o selecionado
  const selectTipoById = (id: number) => {
    return pessoasTipos.find((t) => t.id === id);
  };

  return {
    // Estado
    pessoasTipos,
    pessoasTiposSelecionado,
    loading,
    error,
    pessoasTiposFormatados,
    pessoasTipoAtivos,

    // Ações assíncronas
    fetchPessoasTipos,
    createPessoaTipo,
    editPessoaTipo,
    deletePessoaTipo,
    fetchPessoaTipoById,

    // Ações síncronas
    selectPessoaTipo,
    clearError,
    selectTipoById,
  };
};
