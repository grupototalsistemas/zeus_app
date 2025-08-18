import { Perfil, Permissao } from '@/types/perfil.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PerfilState {
  perfis: Perfil[];
  permissoes: Permissao[];
  perfilSelecionado: Perfil | null;
  loading: boolean;
  error: string | null;
}

const initialState: PerfilState = {
  perfis: [],
  permissoes: [],
  perfilSelecionado: null,
  loading: false,
  error: null,
};

const PerfilSlice = createSlice({
  name: 'perfil',
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

    setPermissoes(state, action: PayloadAction<Permissao[]>) {
      state.permissoes = action.payload;
    },

    setPerfilSelecionado(state, action: PayloadAction<Perfil | null>) {
      state.perfilSelecionado = action.payload;
    },

    clearPerfil(state) {
      state.perfis = [];
      state.permissoes = [];
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
  setPermissoes,
  setPerfilSelecionado,
  clearPerfil,
} = PerfilSlice.actions;

// Seletores
export const selectPerfis = (state: { perfil: PerfilState }) =>
  state.perfil.perfis;
export const selectPermissoes = (state: { perfil: PerfilState }) =>
  state.perfil.permissoes;
export const selectPerfilSelecionado = (state: { perfil: PerfilState }) =>
  state.perfil.perfilSelecionado;
export const selectLoading = (state: { perfil: PerfilState }) =>
  state.perfil.loading;
export const selectError = (state: { perfil: PerfilState }) =>
  state.perfil.error;
export const selectPerfisFormatados = (state: { perfil: PerfilState }) =>
  state.perfil.perfis.map((perfil) => ({
    value: perfil.id || 0,
    label: perfil.descricao,
  }));

export default PerfilSlice.reducer;
