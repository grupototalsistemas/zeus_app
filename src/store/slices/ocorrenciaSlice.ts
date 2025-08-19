import { Ocorrencia, OcorrenciaTipo } from '@/types/ocorrencia.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OcorrenciaState {
  ocorrenciasTipos: OcorrenciaTipo[];
  ocorrencias: Ocorrencia[];
  ocorrenciaTipoSelecionado: OcorrenciaTipo | null;
  ocorrenciaSelecionada: Ocorrencia | null;
  loading: boolean;
  error: string | null;
}

const initialState: OcorrenciaState = {
  ocorrenciasTipos: [],
  ocorrencias: [],
  ocorrenciaTipoSelecionado: null,
  ocorrenciaSelecionada: null,
  loading: false,
  error: null,
};

const OcorrenciaSlice = createSlice({
  name: 'ocorrencia',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Ocorrências Tipos
    setOcorrenciasTipos(state, action: PayloadAction<OcorrenciaTipo[]>) {
      state.ocorrenciasTipos = action.payload;
      state.loading = false;
      state.error = null;
    },

    addOcorrenciaTipo(state, action: PayloadAction<OcorrenciaTipo>) {
      state.ocorrenciasTipos.push(action.payload);
    },

    updateOcorrenciaTipo(state, action: PayloadAction<OcorrenciaTipo>) {
      const index = state.ocorrenciasTipos.findIndex(
        (o) => o.id === action.payload.id
      );
      if (index !== -1) {
        state.ocorrenciasTipos[index] = action.payload;
      }
    },

    removeOcorrenciaTipo(state, action: PayloadAction<number>) {
      state.ocorrenciasTipos = state.ocorrenciasTipos.filter(
        (o) => o.id !== action.payload
      );
    },

    setOcorrenciaTipoSelecionado(
      state,
      action: PayloadAction<OcorrenciaTipo | null>
    ) {
      state.ocorrenciaTipoSelecionado = action.payload;
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
      state.ocorrenciasTipos = [];
      state.ocorrencias = [];
      state.ocorrenciaTipoSelecionado = null;
      state.ocorrenciaSelecionada = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setOcorrenciasTipos,
  addOcorrenciaTipo,
  updateOcorrenciaTipo,
  removeOcorrenciaTipo,
  setOcorrenciaTipoSelecionado,
  setOcorrencias,
  addOcorrencia,
  updateOcorrencia,
  removeOcorrencia,
  setOcorrenciaSelecionada,
  clearOcorrencia,
} = OcorrenciaSlice.actions;

// Seletores
export const selectOcorrenciasTipos = (state: {
  ocorrencia: OcorrenciaState;
}) => state.ocorrencia.ocorrenciasTipos;
export const selectOcorrencias = (state: { ocorrencia: OcorrenciaState }) =>
  state.ocorrencia.ocorrencias;
export const selectOcorrenciaTipoSelecionado = (state: {
  ocorrencia: OcorrenciaState;
}) => state.ocorrencia.ocorrenciaTipoSelecionado;
export const selectOcorrenciaSelecionada = (state: {
  ocorrencia: OcorrenciaState;
}) => state.ocorrencia.ocorrenciaSelecionada;
export const selectLoading = (state: { ocorrencia: OcorrenciaState }) =>
  state.ocorrencia.loading;
export const selectError = (state: { ocorrencia: OcorrenciaState }) =>
  state.ocorrencia.error;
export const selectOcorrenciasTiposFormatados = (state: {
  ocorrencia: OcorrenciaState;
}) =>
  state.ocorrencia.ocorrenciasTipos.map((tipo) => ({
    value: tipo.id || 0,
    label: tipo.descricao,
  }));
export const selectOcorrenciasTiposAtivos = (state: {
  ocorrencia: OcorrenciaState;
}) =>
  state.ocorrencia.ocorrenciasTipos.filter((tipo) => tipo.ativo === 'ATIVO');
export const selectOcorrenciasFormatadas = (state: {
  ocorrencia: OcorrenciaState;
}) =>
  state.ocorrencia.ocorrencias.map((ocorrencia) => ({
    value: ocorrencia.id || 0,
    label: ocorrencia.descricao,
  }));
export const selectOcorrenciasAtivas = (state: {
  ocorrencia: OcorrenciaState;
}) =>
  state.ocorrencia.ocorrencias.filter(
    (ocorrencia) => ocorrencia.ativo === 'ATIVO'
  );

export default OcorrenciaSlice.reducer;
