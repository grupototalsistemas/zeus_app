import { combineReducers } from '@reduxjs/toolkit';

import EmpresaReducer from './slices/empresaSlice';
import PerfilReducer from './slices/perfilSlice';
import PessoaReducer from './slices/pessoaSlice';
import TipoReducer from './slices/tipoSlice';

export const appReducer = combineReducers({
  pessoa: PessoaReducer,
  empresa: EmpresaReducer,
  perfil: PerfilReducer,
  tipo: TipoReducer,
});

export type RootState = ReturnType<typeof appReducer>;

export const rootReducer = (
  state: RootState | undefined,
  action: any
): RootState => {
  if (action.type === 'RESET_APP') {
    return appReducer(undefined, action); // reseta tudo
  }
  return appReducer(state, action);
};
