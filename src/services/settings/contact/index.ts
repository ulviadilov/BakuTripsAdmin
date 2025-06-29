import type { ResponseType } from "../../../types";
import { apiClient } from "../../../utils/axiosInstance";
import type { ContactPayload } from "./types";

async function create(payload:ContactPayload) {
    return await apiClient.post<ResponseType>("ContactInfos/create-contact-info",payload)
}

async function getAll(){
    return await apiClient.get("/ContactInfos/get-all-contact-infos")
}

async function getById(id:string){
    return await apiClient.get(`/ContactInfos/get-by-id?id=${id}`)
}

async function update(id:string,payload:ContactPayload){
    return await apiClient.put(`/ContactInfos/${id}`,payload)
}

async function deleteById(id:string){
    return await apiClient.delete(`/ContactInfos/${id}`)
}

export const contactService = {
    create,
    getAll,
    getById,
    update,
    deleteById
};
