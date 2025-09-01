/** 0=Inativo, 1=Ativo, 2=Excluído */
export enum StatusRegistro {
  INATIVO = 'INATIVO',
  ATIVO = 'ATIVO',
  EXCLUIDO = 'EXCLUIDO',
}

/** Siglas de estados brasileiros */
export enum StatusSiglaEstado {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
}

/** 1=Masculino, 2=Feminino, 3=Neutro, 4=Não Binarie, 5=Ignorado */
export enum StatusGenero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  NEUTRO = 'NEUTRO',
  NAO_BINARIE = 'NAO_BINARIE',
  IGNORADO = 'IGNORADO',
}

/** 1=Sim, 2=Nao */
export enum PerfisAdmintrativos {
  Master = 1,
  Admin = 2,
  Supervisao = 3,
  Gerencia = 4,
  Suporte = 5,
  Atendente = 6,
}

export enum TipoPessoas {
  Usuario = 1,
  Funcionario = 2,
  Tabeliao = 3,
  Escrevente = 4,
  Notificador = 5,
}

export enum IPrioridade {
  PRIORITÁRIA = 'PRIORITÁRIA',
  URGENTE = 'URGENTE',
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  PEQUENA = 'PEQUENA',
}
