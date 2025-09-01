import { SistemaService } from '@/service/sistemas.service';

import { Sistema } from '@/types/sistemas.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface SistemaState {
  sistemas: Sistema[];
  currentSistema: Sistema | null;
  loading: boolean;
  error: string | null;
}

const initialState: SistemaState = {
  sistemas: [],
  currentSistema: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSistemas = createAsyncThunk('sistema/fetchAll', async () => {
  return await SistemaService.getSistemas();
});

export const fetchSistemaById = createAsyncThunk(
  'sistema/fetchById',
  async (id: number) => {
    return await SistemaService.getSistema(id);
  }
);

export const createSistema = createAsyncThunk(
  'sistema/create',
  async (data: Sistema) => {
    return await SistemaService.createSistema(data);
  }
);

export const updateSistema = createAsyncThunk(
  'sistema/update',
  async ({ id, data }: { id: number; data: Sistema }) => {
    return await SistemaService.updateSistema(id, data);
  }
);

export const deleteSistema = createAsyncThunk(
  'sistema/delete',
  async (id: number) => {
    await SistemaService.deleteSistema(id);
    return id;
  }
);

const sistemaSlice = createSlice({
  name: 'sistema',
  initialState,
  reducers: {
    clearCurrentSistema: (state) => {
      state.currentSistema = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchSistemas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSistemas.fulfilled, (state, action) => {
        state.loading = false;
        state.sistemas = action.payload;
      })
      .addCase(fetchSistemas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar sistemas';
      })
      // Fetch By Id
      .addCase(fetchSistemaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSistemaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSistema = action.payload;
      })
      .addCase(fetchSistemaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar sistema';
      })
      // Create
      .addCase(createSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSistema.fulfilled, (state, action) => {
        state.loading = false;
        state.sistemas.push(action.payload);
      })
      .addCase(createSistema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar sistema';
      })
      // Update
      .addCase(updateSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSistema.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sistemas.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.sistemas[index] = action.payload;
        }
      })
      .addCase(updateSistema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar sistema';
      })
      // Delete
      .addCase(deleteSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSistema.fulfilled, (state, action) => {
        state.loading = false;
        state.sistemas = state.sistemas.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSistema.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir sistema';
      });
  },
});

export const { clearCurrentSistema, clearError } = sistemaSlice.actions;

// Selectors
export const selectSistemas = (state: RootState) => state.sistema.sistemas;
export const selectCurrentSistema = (state: RootState) =>
  state.sistema.currentSistema;
export const selectSistemaLoading = (state: RootState) => state.sistema.loading;
export const selectSistemaError = (state: RootState) => state.sistema.error;

export default sistemaSlice.reducer;
