import type { PrivateFormData, PrivateFormDataGet } from "../../types";
import { apiClient } from "../../utils/axiosInstance";
import type { PrivatePackageFormData } from "./types";

const createTour = async (data: PrivateFormData) => {
    const formData = new FormData();
    // Create (camelCase keys as per backend create endpoint convention)
    formData.append("tourCategoryId", data.tourcategoryid);
    formData.append("order", data.order.toString());
    formData.append("name", data.name);
    formData.append("googleMapUrl", data.googlemapurl);
    formData.append("duration", data.duration);
    formData.append("isPopular", data.ispopular.toString());
    formData.append("shortDescription", data.shortdescription);
    formData.append("fullDescription", data.fulldescription);

    // Append arrays
    data.importantinfos.forEach((info, index) => {
        formData.append(`importantInfos[${index}]`, info);
    });
    data.tourprograms.forEach((program, index) => {
        formData.append(`tourPrograms[${index}]`, program);
    });
    data.includes.forEach((include, index) => {
        formData.append(`includes[${index}]`, include);
    });
    data.excludes.forEach((exclude, index) => {
        formData.append(`excludes[${index}]`, exclude);
    });

    if (data.posterimagefile) {
        formData.append("posterImageFile", data.posterimagefile);
    }
    if (data.vrimagefile) {
        formData.append("vrimagefile", data.vrimagefile);
    }
    if (data.tourimagefiles && data.tourimagefiles.length > 0) {
        data.tourimagefiles.forEach((file) => {
            formData.append(`tourimagefiles`, file);
        });
    }

    // Append Translations (capital T) if provided
    if (data.Translations && data.Translations.length > 0) {
        data.Translations.forEach((tr, i) => {
            formData.append(`Translations[${i}].languageCode`, tr.languageCode);
            formData.append(`Translations[${i}].name`, tr.name);
            formData.append(`Translations[${i}].duration`, tr.duration);
            formData.append(`Translations[${i}].shortDescription`, tr.shortDescription);
            formData.append(`Translations[${i}].fullDescription`, tr.fullDescription);
            tr.includes?.forEach((val, j) => formData.append(`Translations[${i}].includes[${j}]`, val));
            tr.excludes?.forEach((val, j) => formData.append(`Translations[${i}].excludes[${j}]`, val));
            tr.importantInfos?.forEach((val, j) => formData.append(`Translations[${i}].importantInfos[${j}]`, val));
            tr.tourPrograms?.forEach((val, j) => formData.append(`Translations[${i}].tourPrograms[${j}]`, val));
        });
    }
    return await apiClient.post("PrivateTours/create-private-tour", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getAllTours = async (page: number, size: number) => {
    return await apiClient.get(`/PrivateTours?page=${page}&size=${size}`);
};

const deleteById = async (id: string) => {
    return await apiClient.delete(`/PrivateTours/${id}`);
};

const getById = async (id: string) => {
    // include all translations for edit pages
    return await apiClient.get(`/PrivateTours/${id}?includeAllTranslations=true`);
};

const updateTour = async (
    id: string,
    data: PrivateFormDataGet,
    newImagesFiles: File[],
    removeIds: string[]
) => {
    const formData = new FormData();
    formData.append("tourcategoryid", data.tourcategoryid);
    formData.append("order", data.order.toString());
    formData.append("name", data.name);
    formData.append("googleMapUrl", data.googlemapurl);
    formData.append("duration", data.duration);
    formData.append("ispopular", data.ispopular.toString());
    formData.append("shortdescription", data.shortdescription);
    formData.append("fulldescription", data.fulldescription);

    // Append arrays
    data.importantinfos.forEach((info, index) => {
        formData.append(`importantinfos[${index}]`, info);
    });
    data.tourprograms.forEach((program, index) => {
        formData.append(`tourprograms[${index}]`, program);
    });
    data.includes.forEach((include, index) => {
        formData.append(`includes[${index}]`, include);
    });
    data.excludes.forEach((exclude, index) => {
        formData.append(`excludes[${index}]`, exclude);
    });

    if (data.posterimagefile) {
        formData.append("posterimagefile", data.posterimagefile);
    }
    if (data.vrimagefile) {
        formData.append("vrimagefile", data.vrimagefile);
    }
    if (newImagesFiles && newImagesFiles.length > 0) {
        newImagesFiles.forEach((file) => {
            formData.append("newtourimagefiles", file);
        });
    }

    // Append Translations (capital T) if provided
    if (data.Translations && data.Translations.length > 0) {
        data.Translations.forEach((tr, i) => {
            formData.append(`Translations[${i}].languageCode`, tr.languageCode);
            formData.append(`Translations[${i}].name`, tr.name);
            formData.append(`Translations[${i}].duration`, tr.duration);
            formData.append(`Translations[${i}].shortDescription`, tr.shortDescription);
            formData.append(`Translations[${i}].fullDescription`, tr.fullDescription);
            tr.includes?.forEach((val, j) => formData.append(`Translations[${i}].includes[${j}]`, val));
            tr.excludes?.forEach((val, j) => formData.append(`Translations[${i}].excludes[${j}]`, val));
            tr.importantInfos?.forEach((val, j) => formData.append(`Translations[${i}].importantInfos[${j}]`, val));
            tr.tourPrograms?.forEach((val, j) => formData.append(`Translations[${i}].tourPrograms[${j}]`, val));
        });
    }
    removeIds.forEach((exclude, index) => {
        formData.append(`removeimageids[${index}]`, exclude);
    });
    return await apiClient.put(`/PrivateTours/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const privateSelect = async () => {
    return await apiClient.get("/PrivateTours/key-values");
};

const createPrivatePackage = async (data: PrivatePackageFormData) => {
    const formData = new FormData();
    formData.append("tourid", data.tourid);
    formData.append("vehicleinfo", data.vehicleinfo);
    formData.append("price", data.price);
    if (data.translations && data.translations.length > 0) {
        data.translations.forEach((tr, i) => {
            formData.append(`translations[${i}].languageCode`, tr.languageCode);
            formData.append(`translations[${i}].vehicleinfo`, tr.vehicleinfo);
        });
    }
    return await apiClient.post(
        "/PrivateTours/create-private-tour-package",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

const getAllPrivatePackages = async (page: number, size: number) => {
    return await apiClient.get(
        `PrivateTours/get-all-private-tour-packages?page=${page}&size=${size}`
    );
};

const getPackageById = async (id: string) => {
    return await apiClient.get(`/PrivateTours/get-private-tour-packages-by-${id}?includeAllTranslations=true`);
};

const deletePackage = async (id: string) => {
    return await apiClient.delete(
        `/PrivateTours/${id}-delete-private-tour-package`
    );
};

const updatePrivatePackage = async (
    id: string,
    data: PrivatePackageFormData
) => {
    const formData = new FormData();
    formData.append("tourid", data.tourid);
    formData.append("vehicleinfo", data.vehicleinfo);
    formData.append("price", data.price);
    if (data.translations && data.translations.length > 0) {
        data.translations.forEach((tr, i) => {
            formData.append(`translations[${i}].languageCode`, tr.languageCode);
            formData.append(`translations[${i}].vehicleinfo`, tr.vehicleinfo);
        });
    }
    return await apiClient.put(
        `/PrivateTours/${id}-update-private-tour-package`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const privateTourService = {
    createTour,
    getAllTours,
    deleteById,
    getById,
    updateTour,
    privateSelect,
    createPrivatePackage,
    getAllPrivatePackages,
    getPackageById,
    deletePackage,
    updatePrivatePackage,
};
