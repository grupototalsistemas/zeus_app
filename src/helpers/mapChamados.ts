import { Chamado } from "@/types/chamado.type";

export const mapChamados = (data: any): Chamado => {
    return {
        id_empresa: data.empresa,
        id_sistema: data.sistema,
        id_pessoa_empresa: data.cliente,
        id_pessoa_usuario: data.usuario,
        id_ocorrencia: data.ocorrencia,
        id_prioridade: data.prioridade,
        titulo: data.title,
        descricao: data.descricao,
        observacao: data.observacao || '',
    };
}