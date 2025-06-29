import { apiClient } from "../../utils/axiosInstance";

interface TourFormData {
    displayOrder: string;
    title: string;
    duration: string;
    basePrice: string;
    posterImagePath: File | null;
}

const createTourPackage = async (payload: any) => {
    return await apiClient.post(
        "TravelPackages/create-travel-package",
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

const getAllPackages = async (page: number, size: number) => {
    return await apiClient.get(
        `/TravelPackages/get-all-travel-package?page=${page}&size=${size}`
    );
};

const deletePackage = async(id:string)=>{
    return await apiClient.delete(`/TravelPackages/${id}`)
}

const getPackageSelect = async () => {
    return await apiClient.get("/TravelPackages/travel-packages-key-values");
};

const getPackageById = async (id: string) => {
    return await apiClient.get(`TravelPackages/${id}`);
};
const updatePackage = async (id: string, data: TourFormData) => {
    const formData = new FormData();
    formData.append("displayorder", data.displayOrder);
    formData.append("duration", data.duration);
    formData.append("baseprice", data.basePrice);
    formData.append("title", data.title);

    console.log(data)
    if (data.posterImagePath) {
        formData.append("posterimagefile", data.posterImagePath);
    }

    return await apiClient.put(`TravelPackages/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const packageTourService = {
    createTourPackage,
    getAllPackages,
    getPackageSelect,
    getPackageById,
    updatePackage,
    deletePackage
};
