import { apiClient } from "../../utils/axiosInstance";

const tourSelect = async () => {
    return await apiClient.get("/Tours/key-values");
};

export const tourService = {
    tourSelect,
};
