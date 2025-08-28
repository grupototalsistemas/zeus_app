    

import { Sistema } from "@/types/sistemas.type";
import api from "./api";

const getSistemas = async (): Promise<Sistema[]> => {
    const response = await api.get('/sistemas')
    console.log(response.data)
    return response.data
}

const getSistema = async (id: number) => {
    const response = await api.get(`/sistema/${id}`)
    return response.data
}

const createSistema = async (data: Sistema) => {
    const response = await api.post('/sistema', data)
    return response.data
}

const updateSistema = async (id: number, data: Sistema) => {
    const response = await api.put(`/sistema/${id}`, data)
    return response.data
}

const deleteSistema = async (id: number) => {
    const response = await api.delete(`/sistema/${id}`)
    return response.data
}

export const SistemaService = {
    getSistemas,
    getSistema,
    createSistema,
    updateSistema,
    deleteSistema
}