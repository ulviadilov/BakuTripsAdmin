import { apiClient } from "../../utils/axiosInstance";

const getAll = async (page: number, size: number) => {
    return await apiClient.get(
        `/TourGuides/get-all-guides?page=${page}&size=${size}`
    );
};

const createGuide = async (data: { language: string; price: number }) => {
    return await apiClient.post("/TourGuides", data);
};

const updateGuide = async (
    id: string,
    data: { language: string; price: number }
) => {
    return await apiClient.put(`/TourGuides/${id}`, data);
};

const getGuide = async (id: string) => {
    return await apiClient.get(`/TourGuides/${id}`);
};

const deleteById = async (id: string) => {
    return await apiClient.delete(`/TourGuides/${id}`);
};

export const guideService = {
    getAll,
    createGuide,
    updateGuide,
    getGuide,
    deleteById,
};
