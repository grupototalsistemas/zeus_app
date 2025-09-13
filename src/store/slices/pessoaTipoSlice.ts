import { PessoaTipo } from '@/types/pessoaTipo.type';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface PessoaTipoState {
  pessoaTipos: PessoaTipo[];
  pessoatipoSelecionado: PessoaTipo | null;
  loading: boolean;
  error: string | null;
}

const initialState: PessoaTipoState = {
  pessoaTipos: [],
  pessoatipoSelecionado: null,
  loading: false,
  error: null,
};

const PessoaTipoSlice = createSlice({
  name: 'pessoa_tipo',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setPessoasTipos(state, action: PayloadAction<PessoaTipo[]>) {
      state.pessoaTipos = action.payload;
      state.loading = false;
      state.error = null;
    },

    addPessoaTipo(state, action: PayloadAction<PessoaTipo>) {
      state.pessoaTipos.push(action.payload);
    },

    updatePessoaTipo(state, action: PayloadAction<PessoaTipo>) {
      const index = state.pessoaTipos.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.pessoaTipos[index] = action.payload;
      }
    },

    removePessoaTipo(state, action: PayloadAction<number>) {
      state.pessoaTipos = state.pessoaTipos.filter(
        (t) => t.id !== action.payload
      );
    },

    setPessoaTipoSelecionado(state, action: PayloadAction<PessoaTipo | null>) {
      state.pessoatipoSelecionado = action.payload;
    },

    clearPessoaTipo(state) {
      state.pessoaTipos = [];
      state.pessoatipoSelecionado = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPessoasTipos,
  addPessoaTipo,
  updatePessoaTipo,
  removePessoaTipo,
  setPessoaTipoSelecionado,
  clearPessoaTipo,
} = PessoaTipoSlice.actions;

// Base selectors
export const selectPessoasTipos = (state: RootState) =>
  state.pessoa_tipo.pessoaTipos;
export const selectPessoaTipoSelecionado = (state: RootState) =>
  state.pessoa_tipo.pessoatipoSelecionado;
export const selectLoading = (state: RootState) => state.pessoa_tipo.loading;
export const selectError = (state: RootState) => state.pessoa_tipo.error;

// Memoized selectors
export const selectPessoasTiposFormatados = createSelector(
  [selectPessoasTipos],
  (pessoaTipos) =>
    pessoaTipos?.map((pessoaTipo: PessoaTipo) => ({
      value: pessoaTipo.id || 0,
      label: pessoaTipo.descricao,
    })) || []
);

export const selectPessoasTiposAtivos = createSelector(
  [selectPessoasTipos],
  (pessoaTipos) =>
    pessoaTipos?.filter(
      (pessoaTipo: PessoaTipo) => pessoaTipo.ativo === 'ATIVO'
    ) || []
);

export default PessoaTipoSlice.reducer;
