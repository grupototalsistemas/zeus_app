import { OcorrenciaService } from '@/service/ocorrencia.service';
import { Ocorrencia } from '@/types/chamadoOcorrencia.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface OcorrenciaState {
  ocorrencias: Ocorrencia[];
  ocorrenciaSelecionada: Ocorrencia | null;
  loading: boolean;
  error: string | null;
}

const initialState: OcorrenciaState = {
  ocorrencias: [],
  ocorrenciaSelecionada: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchOcorrencias = createAsyncThunk(
  'chamado_ocorrencia/fetchAll',
  async () => {
    return await OcorrenciaService.getOcorrencias();
  }
);

export const createOcorrencia = createAsyncThunk(
  'chamado_ocorrencia/create',
  async (data: Omit<Ocorrencia, 'id'>) => {
    return await OcorrenciaService.createOcorrencia(data);
  }
);

export const updateOcorrenciaAsync = createAsyncThunk(
  'chamado_ocorrencia/update',
  async (data: Ocorrencia) => {
    return await OcorrenciaService.updateOcorrencia(data.id!, data);
  }
);

export const deleteOcorrenciaAsync = createAsyncThunk(
  'chamado_ocorrencia/delete',
  async (id: number) => {
    await OcorrenciaService.deleteOcorrencia(id);
    return id;
  }
);

const OcorrenciaSlice = createSlice({
  name: 'chamado_ocorrencia',
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
    setOcorrencias(state, action: PayloadAction<Ocorrencia[]>) {
      state.ocorrencias = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOcorrencia(state, action: PayloadAction<Ocorrencia>) {
      state.ocorrencias.push(action.payload);
    },
    updateOcorrencia(state, action: PayloadAction<Ocorrencia>) {
      const index = state.ocorrencias.findIndex(
        (o) => o.id === action.payload.id
      );
      if (index !== -1) {
        state.ocorrencias[index] = action.payload;
      }
    },
    removeOcorrencia(state, action: PayloadAction<number>) {
      state.ocorrencias = state.ocorrencias.filter(
        (o) => o.id !== action.payload
      );
    },
    setOcorrenciaSelecionada(state, action: PayloadAction<Ocorrencia | null>) {
      state.ocorrenciaSelecionada = action.payload;
    },
    clearOcorrencia(state) {
      state.ocorrencias = [];
      state.ocorrenciaSelecionada = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchOcorrencias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOcorrencias.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrencias = action.payload;
      })
      .addCase(fetchOcorrencias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar ocorrencias';
      })
      // Create
      .addCase(createOcorrencia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOcorrencia.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrencias.push(action.payload);
      })
      .addCase(createOcorrencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar ocorrencia';
      })
      // Update
      .addCase(updateOcorrenciaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOcorrenciaAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ocorrencias.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) {
          state.ocorrencias[index] = action.payload;
        }
      })
      .addCase(updateOcorrenciaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar ocorrencia';
      })
      // Delete
      .addCase(deleteOcorrenciaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOcorrenciaAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrencias = state.ocorrencias.filter(
          (o) => o.id !== action.payload
        );
      })
      .addCase(deleteOcorrenciaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir ocorrencia';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setOcorrencias,
  addOcorrencia,
  updateOcorrencia,
  removeOcorrencia,
  setOcorrenciaSelecionada,
  clearOcorrencia,
} = OcorrenciaSlice.actions;

// Seletores básicos
export const selectOcorrencias = (state: RootState) =>
  state.chamado_ocorrencia.ocorrencias;

export const selectOcorrenciaSelecionada = (state: RootState) =>
  state.chamado_ocorrencia.ocorrenciaSelecionada;

export const selectLoading = (state: RootState) =>
  state.chamado_ocorrencia.loading;

export const selectError = (state: RootState) => state.chamado_ocorrencia.error;

// // Seletores derivados memoizados
export const selectOcorrenciasFormatadas = createSelector(
  [selectOcorrencias],
  (ocorrencias) =>
    (ocorrencias || []).map((ocorrencia) => ({
      value: ocorrencia.id || 0,
      label: ocorrencia.descricao || '',
    }))
);

export const selectOcorrenciasAtivas = createSelector(
  [selectOcorrencias],
  (ocorrencias) =>
    (ocorrencias || []).filter((ocorrencia) => ocorrencia.situacao === 1)
);

export default OcorrenciaSlice.reducer;
