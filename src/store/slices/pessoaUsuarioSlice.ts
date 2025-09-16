import { PessoaUsuarioService } from '@/service/pessoaUsuario.service';
import { PessoaUsuario } from '@/types/pessoaUsuario.type';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

interface PessoaUsuarioState {
  pessoaUsuarios: PessoaUsuario[];
  currentPessoaUsuario: PessoaUsuario | null;
  loading: boolean;
  error: string | null;
}

const initialState: PessoaUsuarioState = {
  pessoaUsuarios: [],
  currentPessoaUsuario: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPessoaUsuarios = createAsyncThunk(
  'pessoaUsuario/fetchAll',
  async () => {
    return await PessoaUsuarioService.getPessoaUsuarios();
  }
);

export const fetchPessoaUsuarioById = createAsyncThunk(
  'pessoaUsuario/fetchById',
  async (id: number) => {
    return await PessoaUsuarioService.getPessoaUsuario(id);
  }
);

export const fetchPessoaUsuarioByPessoa = createAsyncThunk(
  'pessoaUsuario/fetchByPessoa',
  async (pessoaId: number) => {
    return await PessoaUsuarioService.getPessoaUsuarioByPessoa(pessoaId);
  }
);

export const createPessoaUsuario = createAsyncThunk(
  'pessoaUsuario/create',
  async (data: PessoaUsuario) => {
    return await PessoaUsuarioService.createPessoaUsuario(data);
  }
);

export const updatePessoaUsuario = createAsyncThunk(
  'pessoaUsuario/update',
  async ({ id, data }: { id: number; data: PessoaUsuario }) => {
    return await PessoaUsuarioService.updatePessoaUsuario(id, data);
  }
);

export const deletePessoaUsuario = createAsyncThunk(
  'pessoaUsuario/delete',
  async (id: number) => {
    await PessoaUsuarioService.deletePessoaUsuario(id);
    return id;
  }
);

const pessoaUsuarioSlice = createSlice({
  name: 'pessoaUsuario',
  initialState,
  reducers: {
    clearCurrentPessoaUsuario: (state) => {
      state.currentPessoaUsuario = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPessoaUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaUsuarios = action.payload;
      })
      .addCase(fetchPessoaUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar usuários';
      })
      // Fetch By Id
      .addCase(fetchPessoaUsuarioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaUsuarioById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPessoaUsuario = action.payload;
      })
      .addCase(fetchPessoaUsuarioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar usuário';
      })
      // Fetch By Pessoa
      .addCase(fetchPessoaUsuarioByPessoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaUsuarioByPessoa.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaUsuarios = action.payload;
      })
      .addCase(fetchPessoaUsuarioByPessoa.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar usuário da pessoa';
      })
      // Create
      .addCase(createPessoaUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPessoaUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaUsuarios.push(action.payload);
      })
      .addCase(createPessoaUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar usuário';
      })
      // Update
      .addCase(updatePessoaUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePessoaUsuario.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pessoaUsuarios.findIndex(
          (pu) => pu.id === action.payload.id
        );
        if (index !== -1) {
          state.pessoaUsuarios[index] = action.payload;
        }
      })
      .addCase(updatePessoaUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar usuário';
      })
      // Delete
      .addCase(deletePessoaUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePessoaUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaUsuarios = state.pessoaUsuarios.filter(
          (pu) => pu.id !== action.payload
        );
      })
      .addCase(deletePessoaUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir usuário';
      });
  },
});

export const { clearCurrentPessoaUsuario, clearError } =
  pessoaUsuarioSlice.actions;

// Selectors
export const selectPessoaUsuarios = (state: RootState) =>
  state.pessoa_usuario.pessoaUsuarios;
export const selectCurrentPessoaUsuario = (state: RootState) =>
  state.pessoa_usuario.currentPessoaUsuario;
export const selectPessoaUsuarioLoading = (state: RootState) =>
  state.pessoa_usuario.loading;
export const selectPessoaUsuarioError = (state: RootState) =>
  state.pessoa_usuario.error;
// Selectors formatados (para compatibilidade)

export const selectPessoaUsuariosFormatados = createSelector(
  [selectPessoaUsuarios],
  (pessoaUsuario: PessoaUsuario[]) =>
    pessoaUsuario.map((prioridade: PessoaUsuario) => ({
      value: prioridade.id || 0,
      label: prioridade.login,
    })) || []
);

export default pessoaUsuarioSlice.reducer;
