import { EmpresaTipoService } from '@/service/empresaTipo.service';
import { EmpresaTipo } from '@/types/empresaTipo.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface EmpresaTipoState {
  empresaTipos: EmpresaTipo[];
  currentEmpresaTipo: EmpresaTipo | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmpresaTipoState = {
  empresaTipos: [],
  currentEmpresaTipo: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEmpresaTipos = createAsyncThunk(
  'empresaTipo/fetchAll',
  async () => {
    return await EmpresaTipoService.getEmpresaTipos();
  }
);

export const fetchEmpresaTipoById = createAsyncThunk(
  'empresaTipo/fetchById',
  async (id: number) => {
    return await EmpresaTipoService.getEmpresaTipo(id);
  }
);

export const createEmpresaTipo = createAsyncThunk(
  'empresaTipo/create',
  async (data: EmpresaTipo) => {
    return await EmpresaTipoService.createEmpresaTipo(data);
  }
);

export const updateEmpresaTipo = createAsyncThunk(
  'empresaTipo/update',
  async ({ id, data }: { id: number; data: EmpresaTipo }) => {
    return await EmpresaTipoService.updateEmpresaTipo(id, data);
  }
);

export const deleteEmpresaTipo = createAsyncThunk(
  'empresaTipo/delete',
  async (id: number) => {
    await EmpresaTipoService.deleteEmpresaTipo(id);
    return id;
  }
);

const empresaTipoSlice = createSlice({
  name: 'empresaTipo',
  initialState,
  reducers: {
    clearCurrentEmpresaTipo: (state) => {
      state.currentEmpresaTipo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEmpresaTipos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaTipos.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaTipos = action.payload;
      })
      .addCase(fetchEmpresaTipos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar tipos de empresa';
      })
      // Fetch By Id
      .addCase(fetchEmpresaTipoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaTipoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmpresaTipo = action.payload;
      })
      .addCase(fetchEmpresaTipoById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar tipo de empresa';
      })
      // Create
      .addCase(createEmpresaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmpresaTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaTipos.push(action.payload);
      })
      .addCase(createEmpresaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar tipo de empresa';
      })
      // Update
      .addCase(updateEmpresaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpresaTipo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.empresaTipos.findIndex(
          (et) => et.id === action.payload.id
        );
        if (index !== -1) {
          state.empresaTipos[index] = action.payload;
        }
      })
      .addCase(updateEmpresaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao atualizar tipo de empresa';
      })
      // Delete
      .addCase(deleteEmpresaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpresaTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaTipos = state.empresaTipos.filter(
          (et) => et.id !== action.payload
        );
      })
      .addCase(deleteEmpresaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir tipo de empresa';
      });
  },
});

export const { clearCurrentEmpresaTipo, clearError } = empresaTipoSlice.actions;

// Selectors
export const selectEmpresaTipos = (state: RootState) =>
  state.empresa_tipo.empresaTipos;
export const selectCurrentEmpresaTipo = (state: RootState) =>
  state.empresa_tipo.currentEmpresaTipo;
export const selectEmpresaTipoLoading = (state: RootState) =>
  state.empresa_tipo.loading;
export const selectEmpresaTipoError = (state: RootState) =>
  state.empresa_tipo.error;

export default empresaTipoSlice.reducer;
