import { combineReducers } from '@reduxjs/toolkit';

import EmpresaCategoriaReducer from './slices/empresaCategoriaSlice';
import EmpresaSistemaReducer from './slices/empresaSistemaSlice';
import EmpresaReducer from './slices/empresaSlice';
import EmpresaTipoReducer from './slices/empresaTipoSlice';
import SistemaReducer from './slices/sistemaSlice';

import PerfilReducer from './slices/perfilSlice';
import PessoaReducer from './slices/pessoaSlice';
import PessoaTipoReducer from './slices/pessoaTipoSlice';
import PessoaUsuarioReducer from './slices/pessoaUsuarioSlice';

import ChamadoReducer from './slices/chamadoSlice';
import EtapaMovimentoReducer from './slices/etapaMovimento.slice';
import MovimentoAnexoReducer from './slices/movimentoAnexoSlice';
import MovimentoMensagemReducer from './slices/movimentoMensagemSlice';
import MovimentoReducer from './slices/movimentoSlice';
import OcorrenciaReducer from './slices/ocorrenciaSlice';
import OcorrenciaTipoReducer from './slices/ocorrenciaTipoSlice';
import PrioridadeReducer from './slices/prioridadeSlice';

export const appReducer = combineReducers({
  empresa: EmpresaReducer,
  empresa_tipo: EmpresaTipoReducer,
  sistema: SistemaReducer,
  empresa_sistema: EmpresaSistemaReducer,
  empresa_categoria: EmpresaCategoriaReducer,

  pessoa: PessoaReducer,
  pessoa_perfil: PerfilReducer,
  pessoa_tipo: PessoaTipoReducer,
  pessoa_usuario: PessoaUsuarioReducer,

  chamado: ChamadoReducer,
  chamado_ocorrencia_tipo: OcorrenciaTipoReducer,
  chamado_ocorrencia: OcorrenciaReducer,
  chamado_prioridade: PrioridadeReducer,
  chamado_movimento: MovimentoReducer,
  chamado_etapa_movimento: EtapaMovimentoReducer,
  chamado_movimento_anexo: MovimentoAnexoReducer,
  chamado_movimento_mensagem: MovimentoMensagemReducer,
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
