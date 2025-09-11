import { PessoaService } from '@/service/pessoa.service';
import { StatusGenero } from '@/types/enum';
import { Pessoa } from '@/types/pessoa.type';
import { loginResponse } from '@/types/pessoaUsuario.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

export interface CreatePessoaDto {
  empresaId: number;
  tipoId: number;
  genero: StatusGenero;
  nome: string;
  nomeSocial?: string;
}

export interface UpdatePessoaDto extends Partial<CreatePessoaDto> {
  id: number;
}

interface PessoaState {
  pessoas: Pessoa[];
  currentPessoa: Pessoa | null;
  pessoaLogada: Pessoa | null;
  pessoaInfo: loginResponse;
  loading: boolean;
  error: string | null;
}

const initialState: PessoaState = {
  pessoas: [],
  currentPessoa: null,
  pessoaLogada: null,
  pessoaInfo: {
    id: '',
    email: '',
    login: '',
    pessoaId: '',
    nome: '',
    nomeSocial: '',
    perfilId: '',
    genero: '',
    perfil: '',
  },
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPessoas = createAsyncThunk('pessoa/fetchAll', async () => {
  return await PessoaService.getPessoas();
});

export const fetchPessoasByEmpresa = createAsyncThunk(
  'pessoa/fetchByEmpresa',
  async (empresaId: number) => {
    return await PessoaService.getPessoasByEmpresa(empresaId);
  }
);

export const fetchPessoasByTipo = createAsyncThunk(
  'pessoa/fetchByTipo',
  async (tipoId: number) => {
    return await PessoaService.getPessoasByTipo(tipoId);
  }
);

export const fetchPessoaById = createAsyncThunk(
  'pessoa/fetchById',
  async (id: number) => {
    return await PessoaService.getPessoa(id);
  }
);

export const createPessoa = createAsyncThunk(
  'pessoa/create',
  async (data: CreatePessoaDto) => {
    return await PessoaService.createPessoa(data);
  }
);

export const updatePessoa = createAsyncThunk(
  'pessoa/update',
  async ({ id, data }: { id: number; data: Partial<Pessoa> }) => {
    const pessoa = { ...data } as Pessoa; // garante que todos os campos sejam preenchidos
    return await PessoaService.updatePessoa(id, pessoa);
  }
);

export const deletePessoa = createAsyncThunk(
  'pessoa/delete',
  async (id: number) => {
    await PessoaService.deletePessoa(id);
    return id;
  }
);

// Login específico
// export const loginPessoa = createAsyncThunk(
//   'pessoa/login',
//   async (credentials: { login: string; senha: string }) => {
//     return await PessoaService.login(credentials);
//   }
// );

export const fetchPessoaLogada = createAsyncThunk(
  'pessoa/fetchLogada',
  async (pessoaId: string) => {
    return await PessoaService.getPessoa(Number(pessoaId));
  }
);

const pessoaSlice = createSlice({
  name: 'pessoa',
  initialState,
  reducers: {
    setPessoa: (state, action: PayloadAction<loginResponse>) => {
      state.pessoaInfo = action.payload;
      state.error = null;
    },

    setPessoaLogada: (state, action: PayloadAction<Pessoa>) => {
      state.pessoaLogada = action.payload;
      state.error = null;
    },

    clearCurrentPessoa: (state) => {
      state.currentPessoa = null;
    },

    clearLogin: (state) => {
      state.pessoaInfo = {
        id: '',
        email: '',
        login: '',
        pessoaId: '',
        nome: '',
        nomeSocial: '',
        perfilId: '',
        genero: '',
        perfil: '',
      };
      state.pessoaLogada = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    updatePessoaLocal: (state, action: PayloadAction<Pessoa>) => {
      const index = state.pessoas.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.pessoas[index] = action.payload;
      }
      if (state.currentPessoa?.id === action.payload.id) {
        state.currentPessoa = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPessoas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoas.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoas = action.payload;
      })
      .addCase(fetchPessoas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar pessoas';
      })

      // Fetch By Empresa
      .addCase(fetchPessoasByEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoasByEmpresa.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoas = action.payload;
      })
      .addCase(fetchPessoasByEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar pessoas da empresa';
      })

      // Fetch By Tipo
      .addCase(fetchPessoasByTipo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoasByTipo.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoas = action.payload;
      })
      .addCase(fetchPessoasByTipo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar pessoas do tipo';
      })

      // Fetch By Id
      .addCase(fetchPessoaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPessoa = action.payload;
      })
      .addCase(fetchPessoaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar pessoa';
      })

      // Create
      .addCase(createPessoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPessoa.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoas.push(action.payload);
        state.currentPessoa = action.payload;
      })
      .addCase(createPessoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar pessoa';
      })

      // Update
      .addCase(updatePessoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePessoa.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pessoas.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.pessoas[index] = action.payload;
        }
        if (state.currentPessoa?.id === action.payload.id) {
          state.currentPessoa = action.payload;
        }
      })
      .addCase(updatePessoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao atualizar pessoa';
      })

      // Delete
      .addCase(deletePessoa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePessoa.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoas = state.pessoas.filter((p) => p.id !== action.payload);
        if (state.currentPessoa?.id === action.payload) {
          state.currentPessoa = null;
        }
      })
      .addCase(deletePessoa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao excluir pessoa';
      })

      // Login
      // .addCase(loginPessoa.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(loginPessoa.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.pessoaInfo = action.payload;
      // })
      // .addCase(loginPessoa.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Erro ao fazer login';
      // })

      // Fetch Pessoa Logada
      .addCase(fetchPessoaLogada.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPessoaLogada.fulfilled, (state, action) => {
        state.loading = false;
        state.pessoaLogada = action.payload;
      })
      .addCase(fetchPessoaLogada.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Erro ao carregar dados da pessoa logada';
      });
  },
});

export const {
  setPessoa,
  setPessoaLogada,
  clearCurrentPessoa,
  clearLogin,
  clearError,
  updatePessoaLocal,
} = pessoaSlice.actions;

// Selectors
export const selectPessoas = (state: RootState) => state.pessoa.pessoas;
export const selectCurrentPessoa = (state: RootState) =>
  state.pessoa.currentPessoa;
export const selectPessoaLogada = (state: RootState) =>
  state.pessoa.pessoaLogada;
export const selectPessoaInfo = (state: RootState) => state.pessoa.pessoaInfo;
export const selectPessoaLoading = (state: RootState) => state.pessoa.loading;
export const selectPessoaError = (state: RootState) => state.pessoa.error;

// Selectors formatados (para compatibilidade)
export const selectPessoasFormatadas = (state: RootState) =>
  state.pessoa.pessoas.map((pessoa) => ({
    value: pessoa.id,
    label: pessoa.nomeSocial || pessoa.nome,
  }));

// Selector para filtrar por empresa
export const selectPessoasByEmpresa =
  (empresaId: number) => (state: RootState) =>
    state.pessoa.pessoas.filter((pessoa) => pessoa.empresaId === empresaId);

// Selector para filtrar por tipo
export const selectPessoasByTipo = (tipoId: number) => (state: RootState) =>
  state.pessoa.pessoas.filter((pessoa) => pessoa.tipoId === tipoId);

// Selector para verificar se usuário está logado
export const selectIsLoggedIn = (state: RootState) =>
  !!state.pessoa.pessoaInfo.id && !!state.pessoa.pessoaInfo.pessoaId;

export default pessoaSlice.reducer;
