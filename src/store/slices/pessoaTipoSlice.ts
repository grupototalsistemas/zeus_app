import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface PessoaTipo {
  id: number;
  nome: string;
}

interface PessoaTipoState {
  tipos: PessoaTipo[];
  loading: boolean;
  error: string | null;
}

const initialState: PessoaTipoState = {
  tipos: [
    { id: 1, nome: 'Funcionário' },
    { id: 2, nome: 'Tabelião' },
    { id: 3, nome: 'Escrevente' },
    { id: 4, nome: 'Notificador' }
  ],
  loading: false,
  error: null,
};

const pessoaTipoSlice = createSlice({
  name: 'pessoaTipo',
  initialState,
  reducers: {},
});

// Seletores
export const selectPessoaTiposFormatados = (state: RootState) =>
  state.pessoaTipo.tipos.map((tipo) => ({
    value: tipo.id.toString(),
    label: tipo.nome,
  }));

export default pessoaTipoSlice.reducer;
