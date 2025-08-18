import { Tipo } from '@/types/tipo.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TipoState {
  tipos: Tipo[];
  tipoSelecionado: Tipo | null;
  loading: boolean;
  error: string | null;
}

const initialState: TipoState = {
  tipos: [],
  tipoSelecionado: null,
  loading: false,
  error: null,
};

const TipoSlice = createSlice({
  name: 'tipo',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setTipos(state, action: PayloadAction<Tipo[]>) {
      state.tipos = action.payload;
      state.loading = false;
      state.error = null;
    },

    addTipo(state, action: PayloadAction<Tipo>) {
      state.tipos.push(action.payload);
    },

    updateTipo(state, action: PayloadAction<Tipo>) {
      const index = state.tipos.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tipos[index] = action.payload;
      }
    },

    removeTipo(state, action: PayloadAction<number>) {
      state.tipos = state.tipos.filter((t) => t.id !== action.payload);
    },

    setTipoSelecionado(state, action: PayloadAction<Tipo | null>) {
      state.tipoSelecionado = action.payload;
    },

    clearTipo(state) {
      state.tipos = [];
      state.tipoSelecionado = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setTipos,
  addTipo,
  updateTipo,
  removeTipo,
  setTipoSelecionado,
  clearTipo,
} = TipoSlice.actions;

// Seletores
export const selectTipos = (state: { tipo: TipoState }) => state.tipo.tipos;
export const selectTipoSelecionado = (state: { tipo: TipoState }) =>
  state.tipo.tipoSelecionado;
export const selectLoading = (state: { tipo: TipoState }) => state.tipo.loading;
export const selectError = (state: { tipo: TipoState }) => state.tipo.error;
export const selectTiposFormatados = (state: { tipo: TipoState }) =>
  state.tipo.tipos.map((tipo) => ({
    value: tipo.id || 0,
    label: tipo.descricao,
  }));
export const selectTiposAtivos = (state: { tipo: TipoState }) =>
  state.tipo.tipos.filter((tipo) => tipo.ativo === 'ATIVO');

export default TipoSlice.reducer;
