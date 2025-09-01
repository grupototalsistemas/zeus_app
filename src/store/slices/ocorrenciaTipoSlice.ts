import { TipoOcorrenciaService } from '@/service/ocorrenciaTipo.service';
import { OcorrenciaTipo } from '@/types/chamadoOcorrenciaTipo.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface OcorrenciaTipoState {
  ocorrenciaTipos: OcorrenciaTipo[];
  currentOcorrenciaTipo: OcorrenciaTipo | null;
  loading: boolean;
  error: string | null;
}

const initialState: OcorrenciaTipoState = {
  ocorrenciaTipos: [],
  currentOcorrenciaTipo: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchOcorrenciaTipos = createAsyncThunk(
  'ocorrenciaTipo/fetchAll',
  async () => {
    return await TipoOcorrenciaService.getTiposOcorrencia();
  }
);

export const fetchOcorrenciaTipoById = createAsyncThunk(
  'ocorrenciaTipo/fetchById',
  async (id: number) => {
    return await TipoOcorrenciaService.getTipoOcorrencia(id);
  }
);

export const createOcorrenciaTipo = createAsyncThunk(
  'ocorrenciaTipo/create',
  async (data: OcorrenciaTipo) => {
    return await TipoOcorrenciaService.createOcorrenciaTipo(data);
  }
);

export const updateOcorrenciaTipo = createAsyncThunk(
  'ocorrenciaTipo/update',
  async ({ id, data }: { id: number; data: OcorrenciaTipo }) => {
    return await TipoOcorrenciaService.updateOcorrenciaTipo(id, data);
  }
);

export const deleteOcorrenciaTipo = createAsyncThunk(
  'ocorrenciaTipo/delete',
  async (id: number) => {
    await TipoOcorrenciaService.deleteOcorrenciaTipo(id);
    return id;
  }
);

const ocorrenciaTipoSlice = createSlice({
  name: 'ocorrenciaTipo',
  initialState,
  reducers: {
    clearCurrentOcorrenciaTipo: (state) => {
      state.currentOcorrenciaTipo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchOcorrenciaTipos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOcorrenciaTipos.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrenciaTipos = action.payload;
      })
      .addCase(fetchOcorrenciaTipos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar tipos de ocorrência';
      })
      // Fetch By Id
      .addCase(fetchOcorrenciaTipoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOcorrenciaTipoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOcorrenciaTipo = action.payload;
      })
      .addCase(fetchOcorrenciaTipoById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar tipo de ocorrência';
      })
      // Create
      .addCase(createOcorrenciaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOcorrenciaTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrenciaTipos.push(action.payload);
      })
      .addCase(createOcorrenciaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao criar tipo de ocorrência';
      })
      // Update
      .addCase(updateOcorrenciaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOcorrenciaTipo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ocorrenciaTipos.findIndex(
          (ot) => ot.id === action.payload.id
        );
        if (index !== -1) {
          state.ocorrenciaTipos[index] = action.payload;
        }
      })
      .addCase(updateOcorrenciaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao atualizar tipo de ocorrência';
      })
      // Delete
      .addCase(deleteOcorrenciaTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOcorrenciaTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.ocorrenciaTipos = state.ocorrenciaTipos.filter(
          (ot) => ot.id !== action.payload
        );
      })
      .addCase(deleteOcorrenciaTipo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao excluir tipo de ocorrência';
      });
  },
});

export const { clearCurrentOcorrenciaTipo, clearError } =
  ocorrenciaTipoSlice.actions;

// Selectors
export const selectOcorrenciaTipos = (state: RootState) =>
  state.chamado_ocorrencia_tipo.ocorrenciaTipos;
export const selectCurrentOcorrenciaTipo = (state: RootState) =>
  state.chamado_ocorrencia_tipo.currentOcorrenciaTipo;
export const selectOcorrenciaTipoLoading = (state: RootState) =>
  state.chamado_ocorrencia_tipo.loading;
export const selectOcorrenciaTipoError = (state: RootState) =>
  state.chamado_ocorrencia_tipo.error;

export default ocorrenciaTipoSlice.reducer;
