import { Prioridade } from '@/types/chamadoPrioridade.type';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface PrioridadeState {
  prioridades: Prioridade[];
  prioridadeSelecionada: Prioridade | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrioridadeState = {
  prioridades: [],
  prioridadeSelecionada: null,
  loading: false,
  error: null,
};

const PrioridadeSlice = createSlice({
  name: 'chamado_prioridade',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setPrioridades(state, action: PayloadAction<Prioridade[]>) {
      state.prioridades = action.payload;
      state.loading = false;
      state.error = null;
    },

    addPrioridade(state, action: PayloadAction<Prioridade>) {
      state.prioridades.push(action.payload);
    },

    updatePrioridade(state, action: PayloadAction<Prioridade>) {
      const index = state.prioridades.findIndex(
        (p: any) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.prioridades[index] = action.payload;
      }
    },

    removePrioridade(state, action: PayloadAction<number>) {
      state.prioridades = state.prioridades.filter(
        (p: any) => p.id !== action.payload
      );
    },

    setPrioridadeSelecionada(state, action: PayloadAction<Prioridade | null>) {
      state.prioridadeSelecionada = action.payload;
    },

    clearPrioridade(state) {
      state.prioridades = [];
      state.prioridadeSelecionada = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPrioridades,
  addPrioridade,
  updatePrioridade,
  removePrioridade,
  setPrioridadeSelecionada,
  clearPrioridade,
} = PrioridadeSlice.actions;

// Seletores
export const selectPrioridades = (state: RootState) =>
  state.chamado_prioridade.prioridades;
export const selectPrioridadeSelecionada = (state: RootState) =>
  state.chamado_prioridade.prioridadeSelecionada;
export const selectLoading = (state: RootState) =>
  state.chamado_prioridade.loading;
export const selectError = (state: RootState) => state.chamado_prioridade.error;
export const selectPrioridadesFormatadas = createSelector(
  [selectPrioridades],
  (prioridade) =>
    prioridade.map((prioridade: Prioridade) => ({
      value: prioridade.id || 0,
      label: prioridade.descricao,
    })) || []
);
export const selectPrioridadesAtivas = createSelector(
  [selectPrioridades],
  (prioridades) =>
    prioridades.filter((prioridade) => prioridade.ativo === 'ATIVO')
);

export default PrioridadeSlice.reducer;
