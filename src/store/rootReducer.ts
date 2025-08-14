import { combineReducers } from '@reduxjs/toolkit';

import PessoaReducer from './slices/pessoaSlice';
import EmpresaReducer from './slices/empresaSlice';

export const appReducer = combineReducers({
  pessoa: PessoaReducer,
  empresa: EmpresaReducer,
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
