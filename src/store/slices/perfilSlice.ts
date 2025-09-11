import { Perfil } from '@/types/pessoaPerfil.type';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface PerfilState {
  perfis: Perfil[];

  perfilSelecionado: Perfil | null;
  loading: boolean;
  error: string | null;
}

const initialState: PerfilState = {
  perfis: [],

  perfilSelecionado: null,
  loading: false,
  error: null,
};

const PerfilSlice = createSlice({
  name: 'pessoa_perfil',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setPerfis(state, action: PayloadAction<Perfil[]>) {
      state.perfis = action.payload;
      state.loading = false;
      state.error = null;
    },

    addPerfil(state, action: PayloadAction<Perfil>) {
      state.perfis.push(action.payload);
    },

    updatePerfil(state, action: PayloadAction<Perfil>) {
      const index = state.perfis.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.perfis[index] = action.payload;
      }
    },

    removePerfil(state, action: PayloadAction<number>) {
      state.perfis = state.perfis.filter((p) => p.id !== action.payload);
    },

    setPerfilSelecionado(state, action: PayloadAction<Perfil | null>) {
      state.perfilSelecionado = action.payload;
    },

    clearPerfil(state) {
      state.perfis = [];

      state.perfilSelecionado = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPerfis,
  addPerfil,
  updatePerfil,
  removePerfil,

  setPerfilSelecionado,
  clearPerfil,
} = PerfilSlice.actions;

// Seletores
export const selectPerfis = (state: RootState) => state.pessoa_perfil.perfis;

export const selectPerfilSelecionado = (state: RootState) =>
  state.pessoa_perfil.perfilSelecionado;
export const selectLoading = (state: RootState) => state.pessoa_perfil.loading;
export const selectError = (state: RootState) => state.pessoa_perfil.error;
export const selectPerfisFormatados = createSelector([selectPerfis], (perfis) =>
  perfis.map((perfil) => ({
    value: perfil.id || 0,
    label: perfil.descricao,
  }))
);

export default PerfilSlice.reducer;
