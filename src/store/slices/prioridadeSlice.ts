import { PrioridadeService } from '@/service/prioridade.service';
import { Prioridade } from '@/types/chamadoPrioridade.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
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

// Async Thunks
export const fetchPrioridades = createAsyncThunk(
  'chamado_prioridade/fetchAll',
  async () => {
    return await PrioridadeService.getPrioridades();
  }
);

export const fetchPrioridadeById = createAsyncThunk(
  'chamado_prioridade/fetchById',
  async (id: number) => {
    return await PrioridadeService.getPrioridade(id);
  }
);

export const createPrioridade = createAsyncThunk(
  'chamado_prioridade/create',
  async (data: Omit<Prioridade, 'id'>) => {
    return await PrioridadeService.createPrioridade(data);
  }
);

export const updatePrioridadeAsync = createAsyncThunk(
  'chamado_prioridade/update',
  async (data: Prioridade) => {
    return await PrioridadeService.updatePrioridade(data.id!, data);
  }
);

export const deletePrioridadeAsync = createAsyncThunk(
  'chamado_prioridade/delete',
  async (id: number) => {
    await PrioridadeService.deletePrioridade(id);
    return id;
  }
);

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
    clearError(state) {
      state.error = null;
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
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPrioridades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrioridades.fulfilled, (state, action) => {
        state.loading = false;
        state.prioridades = action.payload;
      })
      .addCase(fetchPrioridades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar prioridades';
      })
      // Fetch By Id
      .addCase(fetchPrioridadeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrioridadeById.fulfilled, (state, action) => {
        state.loading = false;
        state.prioridadeSelecionada = action.payload;
      })
      .addCase(fetchPrioridadeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar prioridade';
      })
      // Create
      .addCase(createPrioridade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrioridade.fulfilled, (state, action) => {
        state.loading = false;
        state.prioridades.push(action.payload);
      })
      .addCase(createPrioridade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar prioridade';
      })
      // Update
      .addCase(updatePrioridadeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrioridadeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prioridades.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.prioridades[index] = action.payload;
        }
      })
      .addCase(updatePrioridadeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar prioridade';
      })
      // Delete
      .addCase(deletePrioridadeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrioridadeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.prioridades = state.prioridades.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deletePrioridadeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir prioridade';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
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
