import { PessoaTipoService } from '@/service/pessoaTipo.service';
import { PessoaTipo } from '@/types/pessoaTipo.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
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

// Async Thunks
export const fetchPessoasTipos = createAsyncThunk(
  'pessoa_tipo/fetchAll',
  async () => {
    return await PessoaTipoService.getPessoasTipos();
  }
);

export const fetchPessoaTipoById = createAsyncThunk(
  'pessoa_tipo/fetchById',
  async (id: number) => {
    return await PessoaTipoService.getPessoaTipo(id);
  }
);

export const createPessoaTipo = createAsyncThunk(
  'pessoa_tipo/create',
  async (data: Omit<PessoaTipo, 'id'>) => {
    return await PessoaTipoService.createPessoaTipo(data);
  }
);

export const updatePessoaTipoAsync = createAsyncThunk(
  'pessoa_tipo/update',
  async (data: PessoaTipo) => {
    return await PessoaTipoService.updatePessoaTipo(data.id!, data);
  }
);

export const deletePessoaTipoAsync = createAsyncThunk(
  'pessoa_tipo/delete',
  async (id: number) => {
    await PessoaTipoService.deletePessoaTipo(id);
    return id;
  }
);

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
    clearError(state) {
      state.error = null;
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
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPessoasTipos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoasTipos.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaTipos = action.payload;
      })
      .addCase(fetchPessoasTipos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar tipos de pessoa';
      })
      // Fetch By Id
      .addCase(fetchPessoaTipoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaTipoById.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoatipoSelecionado = action.payload;
      })
      .addCase(fetchPessoaTipoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar tipo de pessoa';
      })
      // Create
      .addCase(createPessoaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPessoaTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaTipos.push(action.payload);
      })
      .addCase(createPessoaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar tipo de pessoa';
      })
      // Update
      .addCase(updatePessoaTipoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePessoaTipoAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pessoaTipos.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.pessoaTipos[index] = action.payload;
        }
      })
      .addCase(updatePessoaTipoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao atualizar tipo de pessoa';
      })
      // Delete
      .addCase(deletePessoaTipoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePessoaTipoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaTipos = state.pessoaTipos.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deletePessoaTipoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir tipo de pessoa';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
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
