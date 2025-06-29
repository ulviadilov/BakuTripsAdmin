import { apiClient } from "../../utils/axiosInstance";

interface AuthData {
    email:string;
    password:string;
}

const login = async (authData:AuthData) => {
    return await apiClient.post("/Auth/admin-login",authData);
};

export const authService = {
    login
}
