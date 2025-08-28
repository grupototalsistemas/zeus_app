import { PerfilService } from '@/service/perfil.service';
import {
  addPerfil,
  clearPerfil,
  removePerfil,
  selectError,
  selectLoading,
  selectPerfilSelecionado,
  selectPerfis,
  selectPerfisFormatados,
  selectPermissoes,
  setError,
  setLoading,
  setPerfilSelecionado,
  setPerfis,
  updatePerfil,
} from '@/store/slices/perfilSlice';
import { Perfil } from '@/types/perfil.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePerfil = () => {
  const dispatch = useDispatch();

  // Seletores
  const perfis = useSelector(selectPerfis);
  const permissoes = useSelector(selectPermissoes);
  const perfilSelecionado = useSelector(selectPerfilSelecionado);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const perfisFormatados = useSelector(selectPerfisFormatados);

  // Ações assíncronas
  const fetchPerfis = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await PerfilService.getPerfis();
      dispatch(setPerfis(response));
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      dispatch(setError('Erro ao carregar perfis'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createPerfil = useCallback(
    async (perfil: Omit<Perfil, 'id'>) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const newPerfil = await PerfilService.createPerfil(perfil);
        dispatch(addPerfil(newPerfil));
        return newPerfil;
      } catch (error) {
        console.error('Erro ao criar perfil:', error);
        dispatch(setError('Erro ao criar perfil'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const editPerfil = useCallback(
    async (perfil: Perfil) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const updatedPerfil = await PerfilService.updatePerfil(
          perfil.id!,
          perfil
        );
        dispatch(updatePerfil(updatedPerfil));
        return updatedPerfil;
      } catch (error) {
        console.error('Erro ao editar perfil:', error);
        dispatch(setError('Erro ao editar perfil'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deletePerfil = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        await PerfilService.deletePerfil(id);
        dispatch(removePerfil(id));
      } catch (error) {
        console.error('Erro ao excluir perfil:', error);
        dispatch(setError('Erro ao excluir perfil'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchPerfilById = useCallback(
    async (id: number) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const perfil = await PerfilService.getPerfil(id);
        dispatch(setPerfilSelecionado(perfil));
        return perfil;
      } catch (error) {
        console.error('Erro ao buscar perfil por ID:', error);
        dispatch(setError('Erro ao buscar perfil'));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchPermissoes = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Assumindo que existe um método para buscar permissões
      // const response = await PerfilService.getPermissoes();
      // dispatch(setPermissoes(response));
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      dispatch(setError('Erro ao carregar permissões'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Ações síncronas
  const selectPerfil = useCallback(
    (perfil: Perfil | null) => {
      dispatch(setPerfilSelecionado(perfil));
    },
    [dispatch]
  );

  const clearPerfilData = useCallback(() => {
    dispatch(clearPerfil());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // selecionar por Id
  const selectPerfilById = 
    (id: number) => {
      return perfis.find((p) => p.id === id);
      
    }

  return {
    // Estado
    perfis,
    permissoes,
    perfilSelecionado,
    loading,
    error,
    perfisFormatados,

    // Ações assíncronas
    fetchPerfis,
    createPerfil,
    editPerfil,
    deletePerfil,
    fetchPerfilById,
    fetchPermissoes,

    // Ações síncronas
    selectPerfil,
    clearPerfilData,
    clearError,
    selectPerfilById
  };
};
