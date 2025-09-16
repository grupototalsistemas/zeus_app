import { EtapaMovimentoService } from '@/service/etapaMovimento.service';
import { ChamadoMovimentoEtapa } from '@/types/chamadoMovimentoEtapa.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface EtapaMovimentoState {
  etapas: ChamadoMovimentoEtapa[];
  etapaAtual: ChamadoMovimentoEtapa | null;
  loading: boolean;
  error: string | null;
}

const initialState: EtapaMovimentoState = {
  etapas: [],
  etapaAtual: null,
  loading: false,
  error: null,
};

export const fetchEtapas = createAsyncThunk(
  'etapaMovimento/fetchEtapas',
  async () => {
    return await EtapaMovimentoService.getEtapas();
  }
);

export const fetchEtapa = createAsyncThunk(
  'etapaMovimento/fetchEtapa',
  async (id: number) => {
    return await EtapaMovimentoService.getEtapa(id);
  }
);

export const createEtapa = createAsyncThunk(
  'etapaMovimento/createEtapa',
  async (data: Partial<ChamadoMovimentoEtapa>) => {
    return await EtapaMovimentoService.createEtapa(data);
  }
);

export const updateEtapa = createAsyncThunk(
  'etapaMovimento/updateEtapa',
  async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<ChamadoMovimentoEtapa>;
  }) => {
    return await EtapaMovimentoService.updateEtapa(id, data);
  }
);

export const deleteEtapa = createAsyncThunk(
  'etapaMovimento/deleteEtapa',
  async (id: number) => {
    await EtapaMovimentoService.deleteEtapa(id);
    return id;
  }
);

const etapaMovimentoSlice = createSlice({
  name: 'chamado_etapa_movimento',
  initialState,
  reducers: {
    clearEtapaAtual: (state) => {
      state.etapaAtual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Etapas
      .addCase(fetchEtapas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEtapas.fulfilled, (state, action) => {
        state.loading = false;
        state.etapas = action.payload;
      })
      .addCase(fetchEtapas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar etapas';
      })

      // Fetch Etapa
      .addCase(fetchEtapa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEtapa.fulfilled, (state, action) => {
        state.loading = false;
        state.etapaAtual = action.payload;
      })
      .addCase(fetchEtapa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar etapa';
      })

      // Create Etapa
      .addCase(createEtapa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEtapa.fulfilled, (state, action) => {
        state.loading = false;
        state.etapas.push(action.payload);
      })
      .addCase(createEtapa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar etapa';
      })

      // Update Etapa
      .addCase(updateEtapa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEtapa.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.etapas.findIndex(
          (etapa) => etapa.id === action.payload.id
        );
        if (index !== -1) {
          state.etapas[index] = action.payload;
        }
      })
      .addCase(updateEtapa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar etapa';
      })

      // Delete Etapa
      .addCase(deleteEtapa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEtapa.fulfilled, (state, action) => {
        state.loading = false;
        state.etapas = state.etapas.filter(
          (etapa) => etapa.id !== action.payload
        );
      })
      .addCase(deleteEtapa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao deletar etapa';
      });
  },
});

// Seletores básicos
export const selectEtapas = (state: RootState) =>
  state.chamado_etapa_movimento.etapas;
export const selectEtapaAtual = (state: RootState) =>
  state.chamado_etapa_movimento.etapaAtual;
export const selectLoadingEtapa = (state: RootState) =>
  state.chamado_etapa_movimento.loading;
export const selectErrorEtapa = (state: RootState) =>
  state.chamado_etapa_movimento.error;

// Seletores formatados para usar em Select
export const selectEtapasFormatadas = createSelector([selectEtapas], (etapas) =>
  etapas.map((etapa) => ({
    value: etapa.id || 0,
    label: etapa.descricao, // ajuste se o campo de exibição for outro
  }))
);

export const selectEtapasAtivas = createSelector([selectEtapas], (etapas) =>
  etapas.filter((etapa) => etapa.ativo === 'ATIVO')
);

export const { clearEtapaAtual, clearError } = etapaMovimentoSlice.actions;

export default etapaMovimentoSlice.reducer;
