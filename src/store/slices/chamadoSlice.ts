import { ChamadoService } from '@/service/chamado.service';
import { Chamado, CreateChamadoDto } from '@/types/chamado.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface ChamadoState {
  chamados: Chamado[];
  currentChamado: Chamado | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChamadoState = {
  chamados: [],
  currentChamado: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchChamados = createAsyncThunk('chamado/fetchAll', async () => {
  return await ChamadoService.getChamados();
});

export const fetchChamadosByEmpresa = createAsyncThunk(
  'chamado/fetchByEmpresa',
  async (empresaId: number) => {
    return await ChamadoService.getChamadosByEmpresa(empresaId);
  }
);

export const fetchChamadosByResponsavel = createAsyncThunk(
  'chamado/fetchByResponsavel',
  async (responsavelId: number) => {
    return await ChamadoService.getChamadosByResponsavel(responsavelId);
  }
);

export const fetchChamadoById = createAsyncThunk(
  'chamado/fetchById',
  async (id: number) => {
    return await ChamadoService.getChamado(id);
  }
);

export const createChamado = createAsyncThunk(
  'chamado/create',
  async (data: CreateChamadoDto) => {
    return await ChamadoService.createChamado(data);
  }
);

export const updateChamado = createAsyncThunk(
  'chamado/update',
  async ({ id, data }: { id: number; data: Chamado }) => {
    return await ChamadoService.updateChamado(id, data);
  }
);

export const deleteChamado = createAsyncThunk(
  'chamado/delete',
  async (id: number) => {
    await ChamadoService.deleteChamado(id);
    return id;
  }
);

const chamadoSlice = createSlice({
  name: 'chamado',
  initialState,
  reducers: {
    clearCurrentChamado: (state) => {
      state.currentChamado = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchChamados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChamados.fulfilled, (state, action) => {
        state.loading = false;
        state.chamados = action.payload;
      })
      .addCase(fetchChamados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar chamados';
      })
      // Fetch By Empresa
      .addCase(fetchChamadosByEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChamadosByEmpresa.fulfilled, (state, action) => {
        state.loading = false;
        state.chamados = action.payload;
      })
      .addCase(fetchChamadosByEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar chamados da empresa';
      })
      // Fetch By Responsavel
      .addCase(fetchChamadosByResponsavel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChamadosByResponsavel.fulfilled, (state, action) => {
        state.loading = false;
        state.chamados = action.payload;
      })
      .addCase(fetchChamadosByResponsavel.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar chamados do responsável';
      })
      // Fetch By Id
      .addCase(fetchChamadoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChamadoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChamado = action.payload;
      })
      .addCase(fetchChamadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar chamado';
      })
      // Create
      .addCase(createChamado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChamado.fulfilled, (state, action) => {
        state.loading = false;
        state.chamados.push(action.payload);
      })
      .addCase(createChamado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar chamado';
      })
      // Update
      .addCase(updateChamado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChamado.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.chamados.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.chamados[index] = action.payload;
        }
      })
      .addCase(updateChamado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar chamado';
      })
      // Delete
      .addCase(deleteChamado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChamado.fulfilled, (state, action) => {
        state.loading = false;
        state.chamados = state.chamados.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteChamado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir chamado';
      });
  },
});

export const { clearCurrentChamado, clearError } = chamadoSlice.actions;

// Selectors
export const selectChamados = (state: RootState) => state.chamado.chamados;
export const selectCurrentChamado = (state: RootState) =>
  state.chamado.currentChamado;
export const selectChamadoLoading = (state: RootState) => state.chamado.loading;
export const selectChamadoError = (state: RootState) => state.chamado.error;

export default chamadoSlice.reducer;
