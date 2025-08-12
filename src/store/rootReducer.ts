import { combineReducers } from '@reduxjs/toolkit';

import PessoaReducer from './slices/pessoaSlice';

export const appReducer = combineReducers({
  pessoa: PessoaReducer,
});

export const rootReducer = (
  state: ReturnType<typeof appReducer>,
  action: any
) => {
  if (action.type === 'RESET_APP') {
    return appReducer(undefined, action); // reseta tudo
  }
  return appReducer(state, action);
};
