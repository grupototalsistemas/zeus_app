import { Empresa } from '@/types/empresa.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
  empresas: Empresa[];
}

const initialState: EmpresaState = {
  empresas: [],
};

const EmpresaSlice = createSlice({
  name: 'empresa',
  initialState,
  reducers: {
    setEmpresas(state, action: PayloadAction<Empresa[]>) {
      console.log('Setting empresas in state:', action.payload);
      state.empresas = action.payload;
    },

    clearEmpresa(state) {
      state.empresas = [];
    },
  },
});

export const { setEmpresas, clearEmpresa } = EmpresaSlice.actions;

// Seletores
export const selectEmpresas = (state: { empresa: EmpresaState }) => state.empresa.empresas;
export const selectEmpresasFormatadas = (state: { empresa: EmpresaState }) => 
  state.empresa.empresas.map((empresa) => ({
    value: empresa.id || 0,
    label: empresa.nomeFantasia,
  }));

export default EmpresaSlice.reducer;
