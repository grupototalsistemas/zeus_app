import { StatusRegistro } from "./enum";

/** Campos padrão de todas as entidades */
export interface BaseEntity {
  ativo?: StatusRegistro;
  motivo?: string;
}