import { EmpresaService } from '@/service/empresa.service';
import { Empresa } from '@/types/empresa.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
  empresas: Empresa[];
  empresa: Empresa;
  loading: boolean;
  error: string | null;
}

const initialState: EmpresaState = {
  empresas: [],
  empresa: {} as Empresa,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEmpresas = createAsyncThunk('empresas/fetchAll', async () => {
  return await EmpresaService.getEmpresas();
});

export const fetchEmpresasById = createAsyncThunk(
  'empresas/fetchById',
  async (id: number) => {
    return await EmpresaService.getEmpresa(id);
  }
);

export const createEmpresas = createAsyncThunk(
  'empresas/create',
  async (data: Empresa) => {
    return await EmpresaService.createEmpresa(data);
  }
);

export const updateEmpresas = createAsyncThunk(
  'empresas/update',
  async ({ id, data }: { id: number; data: Empresa }) => {
    return await EmpresaService.updateEmpresa(id, data);
  }
);

export const deleteEmpresas = createAsyncThunk(
  'empresas/delete',
  async (id: number) => {
    await EmpresaService.deleteEmpresa(id);
    return id;
  }
);

const EmpresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    setEmpresas(state, action: PayloadAction<Empresa[]>) {
      state.empresas = action.payload;
    },
    setEmpresa(state, action: PayloadAction<Empresa>) {
      state.empresa = action.payload;
    },
    clearEmpresas(state) {
      state.empresas = [];
    },
    clearEmpresa(state) {
      state.empresa = {} as Empresa;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEmpresas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresas.fulfilled, (state, action) => {
        state.loading = false;
        state.empresas = action.payload;
      })
      .addCase(fetchEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar empresa';
      })
      // Fetch By Id
      .addCase(fetchEmpresasById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresasById.fulfilled, (state, action) => {
        state.loading = false;
        state.empresa = action.payload;
      })
      .addCase(fetchEmpresasById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar empresa';
      })
      // Create
      .addCase(createEmpresas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmpresas.fulfilled, (state, action) => {
        state.loading = false;
        state.empresas.push(action.payload);
      })
      .addCase(createEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar empresa';
      })
      // Update
      .addCase(updateEmpresas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpresas.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.empresas.findIndex(
          (ec) => ec.id === action.payload.id
        );
        if (index !== -1) {
          state.empresas[index] = action.payload;
        }
      })
      .addCase(updateEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar empresa';
      })
      // Delete
      .addCase(deleteEmpresas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpresas.fulfilled, (state, action) => {
        state.loading = false;
        state.empresas = state.empresas.filter(
          (ec) => ec.id !== action.payload
        );
      })
      .addCase(deleteEmpresas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir empresa';
      });
  },
});

export const {
  setEmpresas,
  setEmpresa,
  clearEmpresas,
  clearEmpresa,
  clearError,
} = EmpresaSlice.actions;

// Seletores básicos
export const selectEmpresas = (state: { empresa: EmpresaState }) =>
  state.empresa.empresas;

export const selectEmpresa = (state: { empresa: EmpresaState }) =>
  state.empresa.empresa;

export const selectEmpresaLoading = (state: { empresa: EmpresaState }) =>
  state.empresa.loading;

export const selectEmpresaError = (state: { empresa: EmpresaState }) =>
  state.empresa.error;

export default EmpresaSlice.reducer;
