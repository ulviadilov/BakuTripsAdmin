import { apiClient } from "../../utils/axiosInstance";

const getAll = async (page: number, size: number) => {
    return await apiClient.get(
        `/TourGuides/get-all-guides?page=${page}&size=${size}`
    );
};

type GuideTranslation = { languageCode: string; language: string };
type GuidePayload = { language: string; price: number; translations?: GuideTranslation[] };

const createGuide = async (data: GuidePayload) => {
    return await apiClient.post("/TourGuides", data);
};

const updateGuide = async (id: string, data: GuidePayload) => {
    return await apiClient.put(`/TourGuides/${id}`, data);
};

const getGuide = async (id: string) => {
    return await apiClient.get(`/TourGuides/${id}?includeAllTranslations=true`);
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
