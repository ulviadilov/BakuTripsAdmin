import { apiClient } from "../../utils/axiosInstance"
import type { ResponseType } from "./types";

interface SelectType{
    key:string;
    value:string
}
const getAll = async(page:number,size:number)=>{
    return await apiClient.get(`/TourCategories/get-all-categories?page=${page}&size=${size}`);
}

const getById = async(id:string)=>{
    return await apiClient.get(`/TourCategories/${id}`)
}

const create = async(payload:{name:string})=>{
    return await apiClient.post<ResponseType>('/TourCategories/create-category',payload);
}

const deleteCategory = async(id:string)=>{
    return await apiClient.delete(`/TourCategories/${id}`)
}

const update = async(id:string,payload:{name:string})=>{
    return await apiClient.put(`/TourCategories/${id}`,{...payload})
}

const categeroySelect = async()=>{
    return await apiClient.get<SelectType[]>('/TourCategories/key-values')
}



export const categoryService = {
    create,
    getAll,
    deleteCategory,
    getById,
    update,
    categeroySelect
}
