import { MovimentoAnexoService } from '@/service/movimentoAnexo.service';
import { MovimentoAnexo } from '@/types/movimentoAnexo.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface MovimentoAnexoState {
  movimentoAnexos: MovimentoAnexo[];
  currentMovimentoAnexo: MovimentoAnexo | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovimentoAnexoState = {
  movimentoAnexos: [],
  currentMovimentoAnexo: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMovimentoAnexos = createAsyncThunk(
  'movimentoAnexo/fetchAll',
  async () => {
    return await MovimentoAnexoService.getMovimentoAnexos();
  }
);

export const fetchMovimentoAnexosByMovimento = createAsyncThunk(
  'movimentoAnexo/fetchByMovimento',
  async (movimentoId: number) => {
    return await MovimentoAnexoService.getMovimentoAnexosByMovimento(
      movimentoId
    );
  }
);

export const fetchMovimentoAnexoById = createAsyncThunk(
  'movimentoAnexo/fetchById',
  async (id: number) => {
    return await MovimentoAnexoService.getMovimentoAnexo(id);
  }
);

export const createMovimentoAnexo = createAsyncThunk(
  'movimentoAnexo/create',
  async (data: MovimentoAnexo) => {
    return await MovimentoAnexoService.createMovimentoAnexo(data);
  }
);

export const updateMovimentoAnexo = createAsyncThunk(
  'movimentoAnexo/update',
  async ({ id, data }: { id: number; data: MovimentoAnexo }) => {
    return await MovimentoAnexoService.updateMovimentoAnexo(id, data);
  }
);

export const deleteMovimentoAnexo = createAsyncThunk(
  'movimentoAnexo/delete',
  async (id: number) => {
    await MovimentoAnexoService.deleteMovimentoAnexo(id);
    return id;
  }
);

export const uploadAnexo = createAsyncThunk(
  'movimentoAnexo/upload',
  async ({ file, movimentoId }: { file: File; movimentoId: number }) => {
    return await MovimentoAnexoService.uploadAnexo(file, movimentoId);
  }
);

export const downloadAnexo = createAsyncThunk(
  'movimentoAnexo/download',
  async (id: number) => {
    return await MovimentoAnexoService.downloadAnexo(id);
  }
);

const movimentoAnexoSlice = createSlice({
  name: 'movimentoAnexo',
  initialState,
  reducers: {
    clearCurrentMovimentoAnexo: (state) => {
      state.currentMovimentoAnexo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchMovimentoAnexos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoAnexos.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoAnexos = action.payload;
      })
      .addCase(fetchMovimentoAnexos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar anexos';
      })
      // Fetch By Movimento
      .addCase(fetchMovimentoAnexosByMovimento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoAnexosByMovimento.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoAnexos = action.payload;
      })
      .addCase(fetchMovimentoAnexosByMovimento.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar anexos do movimento';
      })
      // Fetch By Id
      .addCase(fetchMovimentoAnexoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovimentoAnexoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovimentoAnexo = action.payload;
      })
      .addCase(fetchMovimentoAnexoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar anexo';
      })
      // Create
      .addCase(createMovimentoAnexo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovimentoAnexo.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoAnexos.push(action.payload);
      })
      .addCase(createMovimentoAnexo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar anexo';
      })
      // Update
      .addCase(updateMovimentoAnexo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovimentoAnexo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movimentoAnexos.findIndex(
          (ma) => ma.id === action.payload.id
        );
        if (index !== -1) {
          state.movimentoAnexos[index] = action.payload;
        }
      })
      .addCase(updateMovimentoAnexo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar anexo';
      })
      // Delete
      .addCase(deleteMovimentoAnexo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovimentoAnexo.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoAnexos = state.movimentoAnexos.filter(
          (ma) => ma.id !== action.payload
        );
      })
      .addCase(deleteMovimentoAnexo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir anexo';
      })
      // Upload
      .addCase(uploadAnexo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAnexo.fulfilled, (state, action) => {
        state.loading = false;
        state.movimentoAnexos.push(action.payload);
      })
      .addCase(uploadAnexo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao fazer upload do anexo';
      })
      // Download (não afeta o estado, apenas retorna o blob)
      .addCase(downloadAnexo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadAnexo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadAnexo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao baixar anexo';
      });
  },
});

export const { clearCurrentMovimentoAnexo, clearError } =
  movimentoAnexoSlice.actions;

// Selectors
export const selectMovimentoAnexos = (state: RootState) =>
  state.chamado_movimento_anexo.movimentoAnexos;
export const selectCurrentMovimentoAnexo = (state: RootState) =>
  state.chamado_movimento_anexo.currentMovimentoAnexo;
export const selectMovimentoAnexoLoading = (state: RootState) =>
  state.chamado_movimento_anexo.loading;
export const selectMovimentoAnexoError = (state: RootState) =>
  state.chamado_movimento_anexo.error;

export default movimentoAnexoSlice.reducer;
