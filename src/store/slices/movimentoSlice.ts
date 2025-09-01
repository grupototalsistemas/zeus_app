import { MovimentoService } from '@/service/movimento.service';
import { Movimento } from '@/types/movimento.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface MovimentoState {
  movimentos: Movimento[];
  currentMovimento: Movimento | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovimentoState = {
  movimentos: [],
  currentMovimento: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMovimentos = createAsyncThunk(
  'movimento/fetchAll',
  async () => {
    return await MovimentoService.getMovimentos();
  }
);

export const fetchMovimentosByChamado = createAsyncThunk(
  'movimento/fetchByChamado',
  async (chamadoId: number) => {
    return await MovimentoService.getMovimentosByChamado(chamadoId);
  }
);

export const fetchMovimentoById = createAsyncThunk(
  'movimento/fetchById',
  async (id: number) => {
    return await MovimentoService.getMovimento(id);
  }
);

export const createMovimento = createAsyncThunk(
  'movimento/create',
  async (data: Movimento) => {
    return await MovimentoService.createMovimento(data);
  }
);

export const updateMovimento = createAsyncThunk(
  'movimento/update',
  async ({ id, data }: { id: number; data: Movimento }) => {
    return await MovimentoService.updateMovimento(id, data);
  }
);

export const deleteMovimento = createAsyncThunk(
  'movimento/delete',
  async (id: number) => {
    await MovimentoService.deleteMovimento(id);
    return id;
  }
);

const movimentoSlice = createSlice({
  name: 'movimento',
  initialState,
  reducers: {
    clearCurrentMovimento: (state) => {
      state.currentMovimento = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchMovimentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentos.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentos = action.payload;
      })
      .addCase(fetchMovimentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar movimentos';
      })
      // Fetch By Chamado
      .addCase(fetchMovimentosByChamado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentosByChamado.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentos = action.payload;
      })
      .addCase(fetchMovimentosByChamado.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar movimentos do chamado';
      })
      // Fetch By Id
      .addCase(fetchMovimentoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovimento = action.payload;
      })
      .addCase(fetchMovimentoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar movimento';
      })
      // Create
      .addCase(createMovimento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovimento.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentos.push(action.payload);
      })
      .addCase(createMovimento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar movimento';
      })
      // Update
      .addCase(updateMovimento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovimento.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movimentos.findIndex(
          (m) => m.id === action.payload.id
        );
        if (index !== -1) {
          state.movimentos[index] = action.payload;
        }
      })
      .addCase(updateMovimento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar movimento';
      })
      // Delete
      .addCase(deleteMovimento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovimento.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentos = state.movimentos.filter(
          (m) => m.id !== action.payload
        );
      })
      .addCase(deleteMovimento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir movimento';
      });
  },
});

export const { clearCurrentMovimento, clearError } = movimentoSlice.actions;

// Selectors
export const selectMovimentos = (state: RootState) =>
  state.chamado_movimento.movimentos;
export const selectCurrentMovimento = (state: RootState) =>
  state.chamado_movimento.currentMovimento;
export const selectMovimentoLoading = (state: RootState) =>
  state.chamado_movimento.loading;
export const selectMovimentoError = (state: RootState) =>
  state.chamado_movimento.error;

export default movimentoSlice.reducer;
