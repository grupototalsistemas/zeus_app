import {
  clearCurrentSistema,
  clearError,
  createSistema,
  deleteSistema,
  fetchSistemaById,
  fetchSistemas,
  selectCurrentSistema,
  selectSistemaError,
  selectSistemaLoading,
  selectSistemas,
  updateSistema,
} from '@/store/slices/sistemaSlice';
import { AppDispatch } from '@/store/store';
import { StatusRegistro } from '@/types/enum';
import { Sistema } from '@/types/sistemas.type';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSistema = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sistemas = useSelector(selectSistemas);
  const currentSistema = useSelector(selectCurrentSistema);
  const loading = useSelector(selectSistemaLoading);
  const error = useSelector(selectSistemaError);

  // Funções assíncronas (mantidas como estão)
  const getAll = useCallback(() => {
    return dispatch(fetchSistemas());
  }, [dispatch]);

  const getById = useCallback(
    (id: number) => {
      return dispatch(fetchSistemaById(id));
    },
    [dispatch]
  );

  const create = useCallback(
    (data: Sistema) => {
      return dispatch(createSistema(data));
    },
    [dispatch]
  );

  const update = useCallback(
    (id: number, data: Sistema) => {
      return dispatch(updateSistema({ id, data }));
    },
    [dispatch]
  );

  const remove = useCallback(
    (id: number) => {
      return dispatch(deleteSistema(id));
    },
    [dispatch]
  );

  const clearCurrent = useCallback(() => {
    return dispatch(clearCurrentSistema());
  }, [dispatch]);

  const resetError = useCallback(() => {
    return dispatch(clearError());
  }, [dispatch]);

  // NOVAS FUNÇÕES SÍNCRONAS (operam no estado local)

  // Busca sistema por ID no array local
  const findById = useCallback(
    (id: number) => {
      return sistemas.find((sistema: Sistema) => sistema.id === Number(id));
    },
    [sistemas]
  );

  // Busca sistemas por nome (busca parcial)
  const findByName = useCallback(
    (name: string) => {
      const searchTerm = name.toLowerCase();
      return sistemas.filter((sistema: Sistema) =>
        sistema.nome.toLowerCase().includes(searchTerm)
      );
    },
    [sistemas]
  );

  // Filtra sistemas por status
  const filterByStatus = useCallback(
    (status: StatusRegistro) => {
      return sistemas.filter((sistema: Sistema) => sistema.ativo === status);
    },
    [sistemas]
  );

  // Verifica se um sistema existe pelo ID
  const exists = useCallback(
    (id: number) => {
      return sistemas.some((sistema: Sistema) => sistema.id === id);
    },
    [sistemas]
  );

  // Ordena sistemas por campo específico
  const sortByField = useCallback(
    (field: keyof Sistema, ascending: boolean = true) => {
      return [...sistemas].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (valueA === undefined || valueB === undefined) return 0;

        if (valueA < valueB) return ascending ? -1 : 1;
        if (valueA > valueB) return ascending ? 1 : -1;
        return 0;
      });
    },
    [sistemas]
  );

  // Retorna sistemas paginados
  const getPaginated = useCallback(
    (page: number, pageSize: number) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return sistemas.slice(startIndex, endIndex);
    },
    [sistemas]
  );

  // Conta total de sistemas
  const count = useCallback(() => {
    return sistemas.length;
  }, [sistemas]);

  // Conta sistemas por status
  const countByStatus = useCallback(
    (status: StatusRegistro) => {
      return sistemas.filter((sistema: Sistema) => sistema.ativo === status)
        .length;
    },
    [sistemas]
  );

  return {
    // State
    sistemas,
    currentSistema,
    loading,
    error,

    // Ações assíncronas (originais)
    getAll,
    getById,
    create,
    update,
    remove,
    clearCurrent,
    resetError,

    // Novas ações síncronas
    findById,
    findByName,
    filterByStatus,
    exists,
    sortByField,
    getPaginated,
    count,
    countByStatus,
  };
};
