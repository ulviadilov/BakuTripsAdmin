import { apiClient } from "../../utils/axiosInstance";
import type { PromoCodeCreateRequest, PromoCodeRespone } from "./types";

const createPromoCode = async (data: PromoCodeCreateRequest) => {
    return await apiClient.post("/PromoCodes", data);
};

const getAll = async (page: number, size: number) => {
    return await apiClient.get<PromoCodeRespone>(
        `/PromoCodes?page=${page}&size=${size}`
    );
};

const getPromoById = async (id: string) => {
    return await apiClient.get(`/PromoCodes/${id}`);
};

const deletePromoCode = async (id: string) => {
    return await apiClient.delete(`/PromoCodes/${id}`);
};

const updatePromoCode = async (data: PromoCodeCreateRequest, id: string) => {
    return await apiClient.put(`/PromoCodes/${id}`, data);
};

export const promoService = {
    createPromoCode,
    getAll,
    deletePromoCode,
    getPromoById,
    updatePromoCode,
};
