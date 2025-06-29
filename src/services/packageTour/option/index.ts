import type { PackageTourOption, PackageTourOptionGet } from "../../../types";
import { apiClient } from "../../../utils/axiosInstance";

const createOption = async (data: PackageTourOption) => {
    const formData = new FormData();
    formData.append("packageid", data.packageid);
    formData.append("displayorder", data.displayorder);
    formData.append("optionname", data.optionname);
    formData.append("mapurl", data.mapurl);
    formData.append("shortdescription", data.shortdescription);
    formData.append("apartmentinfo", data.apartmentinfo);
    formData.append("roominfo", data.roominfo);
    formData.append("vehicleinfo", data.vehicleinfo);
    formData.append("fulldescription", data.fulldescription);
    formData.append("price", data.price.toString());

    // Append arrays
    data.importantinfos.forEach((info, index) => {
        formData.append(`importantinfos[${index}]`, info);
    });
    data.includes.forEach((include, index) => {
        formData.append(`includes[${index}]`, include);
    });
    data.excludes.forEach((exclude, index) => {
        formData.append(`excludes[${index}]`, exclude);
    });

    if (data.vrimagefile) {
        formData.append("vrimagefile", data.vrimagefile);
    }
    if (data.tourimagefiles && data.tourimagefiles.length > 0) {
        data.tourimagefiles.forEach((file) => {
            formData.append("tourimagefiles", file);
        });
    }
    return await apiClient.post(
        "TravelPackages/create-package-option",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

// const updateOption = async()

const getAllOptions = async (page: number, size: number) => {
    return await apiClient.get(
        `/TravelPackages/get-all-options?page=${page}&size=${size}`
    );
};

const getOptionById = async (id: string) => {
    return await apiClient.get(`TravelPackages/get-package-option-by-${id}`);
};

const deleteOption = async (id: string) => {
    return await apiClient.delete(
        `TravelPackages/delete-package-option-by-${id}`
    );
};

const update = async (
    id: string,
    data: PackageTourOptionGet,
    newImageFiles: File[],
    removeIds: string[]
) => {
    const formData = new FormData();
    formData.append("travelpackageid", data.packageid);
    formData.append("displayorder", data.displayorder);
    formData.append("optionname", data.optionname);
    formData.append("mapurl", data.mapurl);
    formData.append("shortdescription", data.shortdescription);
    formData.append("apartmentinfo", data.apartmentinfo);
    formData.append("roominfo", data.roominfo);
    formData.append("vehicleinfo", data.vehicleinfo);
    formData.append("fulldescription", data.fulldescription);
    formData.append("price", data.price.toString());

    // Append arrays
    data.importantinfos.forEach((info, index) => {
        formData.append(`importantinfos[${index}]`, info);
    });
    data.includes.forEach((include, index) => {
        formData.append(`includes[${index}]`, include);
    });
    data.excludes.forEach((exclude, index) => {
        formData.append(`excludes[${index}]`, exclude);
    });

    if (data.vrimagefile) {
        formData.append("vrimagefile", data.vrimagefile);
    }
    if (newImageFiles && newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
            formData.append("newtourimagefiles", file);
        });
    }

    removeIds.forEach((exclude, index) => {
        formData.append(`removeimageids[${index}]`, exclude);
    });
    return await apiClient.put(
        `TravelPackages/update-package-option-by-${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

const optionSelect = async()=>{
    return await apiClient.get('/TravelPackages/package-options-key-values')
}

export const packageOptionService = {
    createOption,
    getAllOptions,
    deleteOption,
    getOptionById,
    update,
    optionSelect
};
