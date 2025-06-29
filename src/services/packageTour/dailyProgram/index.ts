import type { DailyProgram } from "../../../types";
import { apiClient } from "../../../utils/axiosInstance";

const createDailyProgram = async(payload:DailyProgram)=>{
    return await apiClient.post('/TravelPackages/create-daily-program',payload)
}

const getAllDailyPrograms = async(page:number,size:number)=>{
    return await apiClient.get(`/TravelPackages/get-all-daily-programs?page=${page}&size=${size}`)
}

const getDailyProgramById = async(id:string)=>{
    return await apiClient.get(`/TravelPackages/get-daily-program-by-${id}`)
}

const deleteDailyProgram = async(id:string)=>{
    return await apiClient.delete(`/TravelPackages/delete-daily-program-by-${id}`)
}

const updateDailyProgram = async(id:string,payload:DailyProgram)=>{
    return await apiClient.put(`/TravelPackages/update-daily-program-by-${id}`,payload)
}

export const dailyProgramService ={
    createDailyProgram,
    getDailyProgramById,
    deleteDailyProgram,
    updateDailyProgram,
    getAllDailyPrograms
}
