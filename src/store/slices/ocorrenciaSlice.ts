import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface OcorrenciaState {
  ocorrencias: Ocorrencia[];
  ocorrenciaSelecionada: Ocorrencia | null;
  loading: boolean;
  error: string | null;
}

const initialState: OcorrenciaState = {
  ocorrencias: [],
  ocorrenciaSelecionada: null,
  loading: false,
  error: null,
};

const OcorrenciaSlice = createSlice({
  name: 'chamado_ocorrencia',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Ocorrências
    setOcorrencias(state, action: PayloadAction<Ocorrencia[]>) {
      state.ocorrencias = action.payload;
      state.loading = false;
      state.error = null;
    },

    addOcorrencia(state, action: PayloadAction<Ocorrencia>) {
      state.ocorrencias.push(action.payload);
    },

    updateOcorrencia(state, action: PayloadAction<Ocorrencia>) {
      const index = state.ocorrencias.findIndex(
        (o) => o.id === action.payload.id
      );
      if (index !== -1) {
        state.ocorrencias[index] = action.payload;
      }
    },

    removeOcorrencia(state, action: PayloadAction<number>) {
      state.ocorrencias = state.ocorrencias.filter(
        (o) => o.id !== action.payload
      );
    },

    setOcorrenciaSelecionada(state, action: PayloadAction<Ocorrencia | null>) {
      state.ocorrenciaSelecionada = action.payload;
    },

    clearOcorrencia(state) {
      state.ocorrencias = [];

      state.ocorrenciaSelecionada = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOcorrencias,
  addOcorrencia,
  updateOcorrencia,
  removeOcorrencia,
  setOcorrenciaSelecionada,
  clearOcorrencia,
} = OcorrenciaSlice.actions;

// Seletores

export const selectOcorrencias = (state: RootState) =>
  state.chamado_ocorrencia.ocorrencias;

export const selectOcorrenciaSelecionada = (state: RootState) =>
  state.chamado_ocorrencia.ocorrenciaSelecionada;
export const selectLoading = (state: RootState) =>
  state.chamado_ocorrencia.loading;
export const selectError = (state: RootState) => state.chamado_ocorrencia.error;

export const selectOcorrenciasFormatadas = (state: RootState) =>
  state.chamado_ocorrencia.ocorrencias.map((ocorrencia) => ({
    value: ocorrencia.id || 0,
    label: ocorrencia.descricao,
  }));
export const selectOcorrenciasAtivas = (state: RootState) =>
  state.chamado_ocorrencia.ocorrencias.filter(
    (ocorrencia) => ocorrencia.ativo === 'ATIVO'
  );

export default OcorrenciaSlice.reducer;
