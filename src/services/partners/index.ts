import { apiClient } from "../../utils/axiosInstance";

const createPartner = async (data: {
    partnerLogoImage: File | null;
    companyName: string;
}) => {
    const formData = new FormData();
    if (data.partnerLogoImage) {
        formData.append("partnerLogoImage", data.partnerLogoImage);
    }
    formData.append("companyName", data.companyName);

    return apiClient.post("/PartnerLogos/create-partner-logo", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getAllPartners = async(page:number,size:number)=>{
    return await apiClient.get(`/PartnerLogos/get-all-partner-logos?page=${page}&size=${size}`)
}

const deletePartner = async (id: string) => {
    return await apiClient.delete(`PartnerLogos/${id}`);
};

const updatePartner = async (
    id: string,
    data: { partnerLogoImage: File | null; companyName: string }
) => {
    const formData = new FormData();
    if(data.partnerLogoImage){
        formData.append("partnerLogoImage", data.partnerLogoImage);
    }
    formData.append("companyName", data.companyName);

    return await apiClient.put(`PartnerLogos/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getPartnerById = async (id: string) => {
    return await apiClient.get<{partnerLogo:{companyName:string,id:string,logoImagePath:string}}>(`PartnerLogos/${id}`);
};

export const partnerService = {
    createPartner,
    deletePartner,
    getPartnerById,
    updatePartner,
    getAllPartners
};
