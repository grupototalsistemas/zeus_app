import { combineReducers } from '@reduxjs/toolkit';

import EmpresaReducer from './slices/empresaSlice';
import OcorrenciaReducer from './slices/ocorrenciaSlice';
import PerfilReducer from './slices/perfilSlice';
import PessoaReducer from './slices/pessoaSlice';
import PrioridadeReducer from './slices/prioridadeSlice';
import TipoReducer from './slices/tipoSlice';

export const appReducer = combineReducers({
  pessoa: PessoaReducer,
  empresa: EmpresaReducer,
  perfil: PerfilReducer,
  tipo: TipoReducer,
  ocorrencia: OcorrenciaReducer,
  prioridade: PrioridadeReducer,
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
