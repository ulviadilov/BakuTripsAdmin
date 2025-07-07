import { apiClient } from "../../utils/axiosInstance";

interface AuthData {
    email:string;
    password:string;
}

const login = async (authData:AuthData) => {
    return await apiClient.post("/Auth/admin-login",authData);
};

const getUser = async()=>{
    return await apiClient.get('/Users/profile')
}

export const authService = {
    login,
    getUser
}
