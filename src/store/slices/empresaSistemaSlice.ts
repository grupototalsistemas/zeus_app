import { EmpresaSistemaService } from '@/service/empresaSistema.service';
import { EmpresaSistema } from '@/types/empresaSistema.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface EmpresaSistemaState {
  empresaSistemas: EmpresaSistema[];
  currentEmpresaSistema: EmpresaSistema | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmpresaSistemaState = {
  empresaSistemas: [],
  currentEmpresaSistema: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEmpresaSistemas = createAsyncThunk(
  'empresaSistema/fetchAll',
  async () => {
    return await EmpresaSistemaService.getEmpresaSistemas();
  }
);

export const fetchEmpresaSistemaByEmpresa = createAsyncThunk(
  'empresaSistema/fetchByEmpresa',
  async (empresaId: number) => {
    return await EmpresaSistemaService.getEmpresaSistemaByEmpresa(empresaId);
  }
);

export const fetchEmpresaSistemaById = createAsyncThunk(
  'empresaSistema/fetchById',
  async (id: number) => {
    return await EmpresaSistemaService.getEmpresaSistema(id);
  }
);

export const createEmpresaSistema = createAsyncThunk(
  'empresaSistema/create',
  async (data: EmpresaSistema) => {
    return await EmpresaSistemaService.createEmpresaSistema(data);
  }
);

export const updateEmpresaSistema = createAsyncThunk(
  'empresaSistema/update',
  async ({ id, data }: { id: number; data: EmpresaSistema }) => {
    return await EmpresaSistemaService.updateEmpresaSistema(id, data);
  }
);

export const deleteEmpresaSistema = createAsyncThunk(
  'empresaSistema/delete',
  async (id: number) => {
    await EmpresaSistemaService.deleteEmpresaSistema(id);
    return id;
  }
);

const empresaSistemaSlice = createSlice({
  name: 'empresaSistema',
  initialState,
  reducers: {
    clearCurrentEmpresaSistema: (state) => {
      state.currentEmpresaSistema = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEmpresaSistemas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaSistemas.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaSistemas = action.payload;
      })
      .addCase(fetchEmpresaSistemas.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar sistemas da empresa';
      })
      // Fetch By Empresa
      .addCase(fetchEmpresaSistemaByEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaSistemaByEmpresa.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaSistemas = action.payload;
      })
      .addCase(fetchEmpresaSistemaByEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar sistemas da empresa';
      })
      // Fetch By Id
      .addCase(fetchEmpresaSistemaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaSistemaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmpresaSistema = action.payload;
      })
      .addCase(fetchEmpresaSistemaById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar sistema da empresa';
      })
      // Create
      .addCase(createEmpresaSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmpresaSistema.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaSistemas.push(action.payload);
      })
      .addCase(createEmpresaSistema.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao criar sistema da empresa';
      })
      // Update
      .addCase(updateEmpresaSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpresaSistema.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.empresaSistemas.findIndex(
          (es) => es.id === action.payload.id
        );
        if (index !== -1) {
          state.empresaSistemas[index] = action.payload;
        }
      })
      .addCase(updateEmpresaSistema.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao atualizar sistema da empresa';
      })
      // Delete
      .addCase(deleteEmpresaSistema.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpresaSistema.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaSistemas = state.empresaSistemas.filter(
          (es) => es.id !== action.payload
        );
      })
      .addCase(deleteEmpresaSistema.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao excluir sistema da empresa';
      });
  },
});

export const { clearCurrentEmpresaSistema, clearError } =
  empresaSistemaSlice.actions;

// Selectors
export const selectEmpresaSistemas = (state: RootState) =>
  state.empresa_sistema.empresaSistemas;
export const selectCurrentEmpresaSistema = (state: RootState) =>
  state.empresa_sistema.currentEmpresaSistema;
export const selectEmpresaSistemaLoading = (state: RootState) =>
  state.empresa_sistema.loading;
export const selectEmpresaSistemaError = (state: RootState) =>
  state.empresa_sistema.error;

export default empresaSistemaSlice.reducer;
