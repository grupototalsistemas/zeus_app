import { EmpresaCategoriaService } from '@/service/empresaCategoria.service';
import { EmpresaCategoria } from '@/types/empresaCategoria.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface EmpresaCategoriaState {
  empresaCategorias: EmpresaCategoria[];
  currentEmpresaCategoria: EmpresaCategoria | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmpresaCategoriaState = {
  empresaCategorias: [],
  currentEmpresaCategoria: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEmpresaCategorias = createAsyncThunk(
  'empresaCategoria/fetchAll',
  async () => {
    return await EmpresaCategoriaService.getEmpresaCategorias();
  }
);

export const fetchEmpresaCategoriaById = createAsyncThunk(
  'empresaCategoria/fetchById',
  async (id: number) => {
    return await EmpresaCategoriaService.getEmpresaCategoria(id);
  }
);

export const createEmpresaCategoria = createAsyncThunk(
  'empresaCategoria/create',
  async (data: EmpresaCategoria) => {
    return await EmpresaCategoriaService.createEmpresaCategoria(data);
  }
);

export const updateEmpresaCategoria = createAsyncThunk(
  'empresaCategoria/update',
  async ({ id, data }: { id: number; data: EmpresaCategoria }) => {
    return await EmpresaCategoriaService.updateEmpresaCategoria(id, data);
  }
);

export const deleteEmpresaCategoria = createAsyncThunk(
  'empresaCategoria/delete',
  async (id: number) => {
    await EmpresaCategoriaService.deleteEmpresaCategoria(id);
    return id;
  }
);

const empresaCategoriaSlice = createSlice({
  name: 'empresaCategoria',
  initialState,
  reducers: {
    clearCurrentEmpresaCategoria: (state) => {
      state.currentEmpresaCategoria = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEmpresaCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaCategorias = action.payload;
      })
      .addCase(fetchEmpresaCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar categorias de empresa';
      })
      // Fetch By Id
      .addCase(fetchEmpresaCategoriaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaCategoriaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmpresaCategoria = action.payload;
      })
      .addCase(fetchEmpresaCategoriaById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar categoria de empresa';
      })
      // Create
      .addCase(createEmpresaCategoria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmpresaCategoria.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaCategorias.push(action.payload);
      })
      .addCase(createEmpresaCategoria.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao criar categoria de empresa';
      })
      // Update
      .addCase(updateEmpresaCategoria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmpresaCategoria.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.empresaCategorias.findIndex(
          (ec) => ec.id === action.payload.id
        );
        if (index !== -1) {
          state.empresaCategorias[index] = action.payload;
        }
      })
      .addCase(updateEmpresaCategoria.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao atualizar categoria de empresa';
      })
      // Delete
      .addCase(deleteEmpresaCategoria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmpresaCategoria.fulfilled, (state, action) => {
        state.loading = false;
        state.empresaCategorias = state.empresaCategorias.filter(
          (ec) => ec.id !== action.payload
        );
      })
      .addCase(deleteEmpresaCategoria.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao excluir categoria de empresa';
      });
  },
});

export const { clearCurrentEmpresaCategoria, clearError } =
  empresaCategoriaSlice.actions;

// Selectors
export const selectEmpresaCategorias = (state: RootState) =>
  state.empresa_categoria.empresaCategorias;
export const selectCurrentEmpresaCategoria = (state: RootState) =>
  state.empresa_categoria.currentEmpresaCategoria;
export const selectEmpresaCategoriaLoading = (state: RootState) =>
  state.empresa_categoria.loading;
export const selectEmpresaCategoriaError = (state: RootState) =>
  state.empresa_categoria.error;
export const selectCategoriasFormatadas = createSelector(
  [selectEmpresaCategorias],
  (categorias) =>
    categorias.map((categoria) => ({
      value: categoria.id || 0,
      label: categoria.descricao,
    }))
);

export default empresaCategoriaSlice.reducer;
