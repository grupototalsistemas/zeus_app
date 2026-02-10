import { PerfilService } from '@/service/perfil.service';
import { Perfil } from '@/types/pessoaPerfil.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
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

// Async Thunks
export const fetchPerfis = createAsyncThunk(
  'pessoa_perfil/fetchAll',
  async () => {
    return await PerfilService.getPerfis();
  }
);

export const fetchPerfilById = createAsyncThunk(
  'pessoa_perfil/fetchById',
  async (id: number) => {
    return await PerfilService.getPerfil(id);
  }
);

export const createPerfil = createAsyncThunk(
  'pessoa_perfil/create',
  async (data: Omit<Perfil, 'id'>) => {
    return await PerfilService.createPerfil(data);
  }
);

export const updatePerfilAsync = createAsyncThunk(
  'pessoa_perfil/update',
  async (data: Perfil) => {
    return await PerfilService.updatePerfil(data.id!, data);
  }
);

export const deletePerfilAsync = createAsyncThunk(
  'pessoa_perfil/delete',
  async (id: number) => {
    await PerfilService.deletePerfil(id);
    return id;
  }
);

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
    clearError(state) {
      state.error = null;
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
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPerfis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfis.fulfilled, (state, action) => {
        state.loading = false;
        state.perfis = action.payload;
      })
      .addCase(fetchPerfis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar perfis';
      })
      // Fetch By Id
      .addCase(fetchPerfilById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfilById.fulfilled, (state, action) => {
        state.loading = false;
        state.perfilSelecionado = action.payload;
      })
      .addCase(fetchPerfilById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar perfil';
      })
      // Create
      .addCase(createPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.perfis.push(action.payload);
      })
      .addCase(createPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar perfil';
      })
      // Update
      .addCase(updatePerfilAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePerfilAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.perfis.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.perfis[index] = action.payload;
        }
      })
      .addCase(updatePerfilAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar perfil';
      })
      // Delete
      .addCase(deletePerfilAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePerfilAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.perfis = state.perfis.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePerfilAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir perfil';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
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
