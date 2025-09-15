import { Empresa } from '@/types/empresa.type';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.empresas = action.payload;
    },
    clearEmpresa(state) {
      state.empresas = [];
    },
  },
});

export const { setEmpresas, clearEmpresa } = EmpresaSlice.actions;

// Seletores básicos
export const selectEmpresas = (state: { empresa: EmpresaState }) =>
  state.empresa.empresas;

// Seletor memoizado
export const selectEmpresasFormatadas = createSelector(
  [selectEmpresas],
  (empresas) =>
    empresas.map((empresa) => ({
      value: empresa.id || 0,
      label: empresa.nomeFantasia,
    }))
);

export default EmpresaSlice.reducer;
