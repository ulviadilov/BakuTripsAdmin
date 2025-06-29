import { apiClient } from "../../utils/axiosInstance";

async function getAll(page: number = 0, size: number) {
    return await apiClient.get(`/Users?page=${page}&size=${size}`);
}

export const userService = {
    getAll,
};
