import { apiClient } from "../../utils/axiosInstance";
import type { RequestDestination } from "./types";

const create = async (destinationData:RequestDestination) => {
    try {
        const formData = new FormData();

        formData.append('tourId', destinationData.tourId);
        formData.append('displayOrder', destinationData.displayOrder);
        formData.append('name', destinationData.name);
        formData.append('duration', destinationData.duration);
        formData.append('description', destinationData.description);

        if (destinationData.imageFile) {
            formData.append('imageFile', destinationData.imageFile);
        }

        // Append capital Translations if provided
        if (destinationData.Translations && Array.isArray(destinationData.Translations)) {
            destinationData.Translations.forEach((t, i) => {
                formData.append(`Translations[${i}].languageCode`, t.languageCode);
                formData.append(`Translations[${i}].name`, t.name || "");
                formData.append(`Translations[${i}].duration`, t.duration || "");
                formData.append(`Translations[${i}].description`, t.description || "");
            });
        }

        // Make API call with FormData
        const response = await apiClient.post('/Destinations/create-destination', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating destination:', error);
        throw error;
    }
};

const getAll = async (page:number,size:number) => {
    try {
        const response = await apiClient.get(`/Destinations/get-all-destinations?page=${page}&size=${size}`);
        return response;
    } catch (error) {
        console.error('Error fetching destinations:', error);
        throw error;
    }
};

const getById = async (id:string) => {
    try {
        const response = await apiClient.get(`/Destinations/${id}?includeAllTranslations=true`);
        return response.data;
    } catch (error) {
        console.error('Error fetching destination:', error);
        throw error;
    }
};

const update = async (id:string, destinationData:RequestDestination) => {
    try {
        const formData = new FormData();

        formData.append('tourId', destinationData.tourId);
        formData.append('displayOrder', destinationData.displayOrder);
        formData.append('name', destinationData.name);
        formData.append('duration', destinationData.duration);
        formData.append('description', destinationData.description);

        if (destinationData.imageFile) {
            formData.append('imageFile', destinationData.imageFile);
        }else{
            formData.append('imageFile', "")
        }

        // Append capital Translations if provided
        if (destinationData.Translations && Array.isArray(destinationData.Translations)) {
            destinationData.Translations.forEach((t, i) => {
                formData.append(`Translations[${i}].languageCode`, t.languageCode);
                formData.append(`Translations[${i}].name`, t.name || "");
                formData.append(`Translations[${i}].duration`, t.duration || "");
                formData.append(`Translations[${i}].description`, t.description || "");
            });
        }

        const response = await apiClient.put(`/destinations/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating destination:', error);
        throw error;
    }
};

const deleteDestination = async (id:string) => {
    try {
        const response = await apiClient.delete(`/Destinations/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting destination:', error);
        throw error;
    }
};


export const destinationService = {
    create,
    getAll,
    getById,
    update,
    delete: deleteDestination
};
