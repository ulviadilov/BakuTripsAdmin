import axios from "axios";
import { paths } from "../constants/path";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 20000,
    maxBodyLength: Infinity,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear stored token and user data
            localStorage.removeItem("token");

            window.location.href = paths.AUTH.LOGIN;
        }

        return Promise.reject(error);
    }
);
