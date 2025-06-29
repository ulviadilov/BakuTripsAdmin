import type {TourFormDataGet } from "../../types";
import { apiClient } from "../../utils/axiosInstance";

const createTour = async (payload: any) => {
    return await apiClient.post("GroupTours/create-group-tour", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getAllTours = async (page: number, size: number) => {
    return await apiClient.get(`/GroupTours?page=${page}&size=${size}`);
};

const getById = async (id: string) => {
    return await apiClient.get(`GroupTours/${id}`);
};

const deleteById = async (id: string) => {
    return await apiClient.delete(`/GroupTours/${id}`);
};

const updateTour = async (
    id: string,
    data: TourFormDataGet,
    newImagesFiles: File[],
    removeIds: string[]
) => {
    const formData = new FormData();
    formData.append("tourcategoryid", data.tourCategoryId);
    formData.append("order", data.order.toString());
    formData.append("name", data.name);
    formData.append("googleMapUrl", data.googleMapUrl);
    formData.append("duration", data.duration);
    formData.append("ispopular", data.isPopular.toString());
    formData.append("shortdescription", data.shortDescription);
    formData.append("fulldescription", data.fullDescription);
    formData.append("priceforadult", data.priceForAdult.toString());
    formData.append("priceforchild", data.priceForChild.toString());
    formData.append("priceforinfant", data.priceForInfant.toString());

    // Append arrays
    data.importantInfos.forEach((info, index) => {
        formData.append(`importantinfos[${index}]`, info);
    });
    data.tourPrograms.forEach((program, index) => {
        formData.append(`tourprograms[${index}]`, program);
    });
    data.includes.forEach((include, index) => {
        formData.append(`includes[${index}]`, include);
    });
    data.excludes.forEach((exclude, index) => {
        formData.append(`excludes[${index}]`, exclude);
    });

    if (data.posterImageFile) {
        formData.append("posterimagefile", data.posterImageFile);
    }
    if (data.vrimagefile) {
        formData.append("vrimagefile", data.vrimagefile);
    }
    if (newImagesFiles && newImagesFiles.length > 0) {
        newImagesFiles.forEach((file) => {
            formData.append("newtourimagefiles", file);
        });
    }

    removeIds.forEach((exclude, index) => {
        formData.append(`removeimageids[${index}]`, exclude);
    });
    return apiClient.put(`GroupTours/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const groupTourService = {
    createTour,
    getAllTours,
    deleteById,
    getById,
    updateTour,
};
