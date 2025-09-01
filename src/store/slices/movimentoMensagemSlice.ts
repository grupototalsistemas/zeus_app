import { MovimentoMensagemService } from '@/service/movimentoMensagem.service';
import { MovimentoMensagem } from '@/types/movimentoMensagem.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface MovimentoMensagemState {
  movimentoMensagens: MovimentoMensagem[];
  currentMovimentoMensagem: MovimentoMensagem | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovimentoMensagemState = {
  movimentoMensagens: [],
  currentMovimentoMensagem: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMovimentoMensagens = createAsyncThunk(
  'movimentoMensagem/fetchAll',
  async () => {
    return await MovimentoMensagemService.getMovimentoMensagens();
  }
);

export const fetchMovimentoMensagensByMovimento = createAsyncThunk(
  'movimentoMensagem/fetchByMovimento',
  async (movimentoId: number) => {
    return await MovimentoMensagemService.getMovimentoMensagensByMovimento(
      movimentoId
    );
  }
);

export const fetchMovimentoMensagemById = createAsyncThunk(
  'movimentoMensagem/fetchById',
  async (id: number) => {
    return await MovimentoMensagemService.getMovimentoMensagem(id);
  }
);

export const createMovimentoMensagem = createAsyncThunk(
  'movimentoMensagem/create',
  async (data: MovimentoMensagem) => {
    return await MovimentoMensagemService.createMovimentoMensagem(data);
  }
);

export const updateMovimentoMensagem = createAsyncThunk(
  'movimentoMensagem/update',
  async ({ id, data }: { id: number; data: MovimentoMensagem }) => {
    return await MovimentoMensagemService.updateMovimentoMensagem(id, data);
  }
);

export const deleteMovimentoMensagem = createAsyncThunk(
  'movimentoMensagem/delete',
  async (id: number) => {
    await MovimentoMensagemService.deleteMovimentoMensagem(id);
    return id;
  }
);

const movimentoMensagemSlice = createSlice({
  name: 'movimentoMensagem',
  initialState,
  reducers: {
    clearCurrentMovimentoMensagem: (state) => {
      state.currentMovimentoMensagem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchMovimentoMensagens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoMensagens.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoMensagens = action.payload;
      })
      .addCase(fetchMovimentoMensagens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar mensagens';
      })
      // Fetch By Movimento
      .addCase(fetchMovimentoMensagensByMovimento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMovimentoMensagensByMovimento.fulfilled,
        (state, action) => {
          state.loading = false;
          state.movimentoMensagens = action.payload;
        }
      )
      .addCase(fetchMovimentoMensagensByMovimento.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar mensagens do movimento';
      })
      // Fetch By Id
      .addCase(fetchMovimentoMensagemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoMensagemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovimentoMensagem = action.payload;
      })
      .addCase(fetchMovimentoMensagemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar mensagem';
      })
      // Create
      .addCase(createMovimentoMensagem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovimentoMensagem.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoMensagens.push(action.payload);
      })
      .addCase(createMovimentoMensagem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar mensagem';
      })
      // Update
      .addCase(updateMovimentoMensagem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovimentoMensagem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movimentoMensagens.findIndex(
          (mm) => mm.id === action.payload.id
        );
        if (index !== -1) {
          state.movimentoMensagens[index] = action.payload;
        }
      })
      .addCase(updateMovimentoMensagem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar mensagem';
      })
      // Delete
      .addCase(deleteMovimentoMensagem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovimentoMensagem.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoMensagens = state.movimentoMensagens.filter(
          (mm) => mm.id !== action.payload
        );
      })
      .addCase(deleteMovimentoMensagem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir mensagem';
      });
  },
});

export const { clearCurrentMovimentoMensagem, clearError } =
  movimentoMensagemSlice.actions;

// Selectors
export const selectMovimentoMensagens = (state: RootState) =>
  state.chamado_movimento_mensagem.movimentoMensagens;
export const selectCurrentMovimentoMensagem = (state: RootState) =>
  state.chamado_movimento_mensagem.currentMovimentoMensagem;
export const selectMovimentoMensagemLoading = (state: RootState) =>
  state.chamado_movimento_mensagem.loading;
export const selectMovimentoMensagemError = (state: RootState) =>
  state.chamado_movimento_mensagem.error;

export default movimentoMensagemSlice.reducer;
