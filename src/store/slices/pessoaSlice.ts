import { loginResponse } from '@/types/pessoaUsuario.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  pessoaInfo: loginResponse;
}

const initialState: LoginState = {
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
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setPessoa(state, action: PayloadAction<loginResponse>) {
      state.pessoaInfo = action.payload;
    },

    clearLogin(state) {
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
    },
  },
});

export const { setPessoa, clearLogin } = loginSlice.actions;
export default loginSlice.reducer;
