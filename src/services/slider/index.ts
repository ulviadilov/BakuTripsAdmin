import { apiClient } from "../../utils/axiosInstance";
import type { SliderType, SliderUpdateType } from "./type";

const getAll = async (page: number, size: number) => {
    return await apiClient.get(
        `/Sliders/get-all-sliders?page=${page}&size=${size}`
    );
};

const getById = async (id: string) => {
    return await apiClient.get(`/Sliders/${id}?includeAllTranslations=true`);
};

const deleteById = async (id: string) => {
    return await apiClient.delete(`/Sliders/${id}`);
};

const createSlider = async (data: SliderType) => {
    console.log(data);
    const formData = new FormData();
    if (data.displayOrder) {
        formData.append("displayOrder", data.displayOrder.toString());
    }
    if (data.title) {
        formData.append("title", data.title);
    }
    if (data.subTitle) {
        formData.append("subTitle", data.subTitle);
    }
    if (data.backgroundImage) {
        formData.append("backgroundImage", data.backgroundImage);
    }
    if (data.translations && data.translations.length > 0) {
        data.translations.forEach((tr, index) => {
            Object.keys(tr).forEach((key: string) => {
                formData.append(
                    `translations[${index}].${key}`,
                    tr[key as keyof typeof tr]
                );
            });
        });
    }

    return await apiClient.post("/Sliders/create-slider", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
const updateSlider = async (id: string, data: SliderUpdateType) => {
    const formData = new FormData();
    if (data.displayOrder) {
        formData.append("displayOrder", data.displayOrder.toString());
    }
    if (data.title) {
        formData.append("title", data.title);
    }
    if (data.subTitle) {
        formData.append("subTitle", data.subTitle);
    }
    if (data.backgroundImagePath) {
        formData.append("imageFile", data.backgroundImagePath);
    }
    if (data.translations && data.translations.length > 0) {
        data.translations.forEach((tr, index) => {
            Object.keys(tr).forEach((key: string) => {
                formData.append(
                    `translations[${index}].${key}`,
                    tr[key as keyof typeof tr]
                );
            });
        });
    }

    return await apiClient.put(`/Sliders/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const sliderService = {
    getAll,
    getById,
    deleteById,
    updateSlider,
    createSlider,
};
