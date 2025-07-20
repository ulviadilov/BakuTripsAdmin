import { apiClient } from "../../utils/axiosInstance";
import type { MemberRequest, MemberRequestUpdate } from "./types";

const memberCreate = async (data: MemberRequest) => {
    const formData = new FormData();
    if (data.firstname) {
        formData.append("firstname", data.firstname);
    }
    if (data.lastname) {
        formData.append("lastname", data.lastname);
    }
    if (data.team) {
        formData.append("team", data.team);
    }
    if (data.description) {
        formData.append("description", data.description);
    }
    if (data.position) {
        formData.append("position", data.position);
    }
    if (data.posterImage) {
        formData.append("posterImage", data.posterImage);
    }
    if (data.hoverImage) {
        formData.append("hoverImage", data.hoverImage);
    }

    return await apiClient.post("/TeamMembers", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getAllMembers = async (page:number = 0,size:number = 10) => {
    return await apiClient.get(`/TeamMembers?page=${page}&size=${size}`);
};

const getMemberById = async (id: string) => {
    return await apiClient.get(`/TeamMembers/${id}`);
};

const updateMember = async (id: string, data: MemberRequestUpdate) => {
    const formData = new FormData();

    if (data.firstname) {
        formData.append("firstname", data.firstname);
    }
    if (data.lastname) {
        formData.append("lastname", data.lastname);
    }
    if (data.team) {
        formData.append("team", data.team);
    }
    if (data.description) {
        formData.append("description", data.description);
    }
    if (data.position) {
        formData.append("position", data.position);
    }
    if (data.posterImage) {
        formData.append("posterImage", data.posterImage);
    }
    if (data.hoverImage) {
        formData.append("hoverImage", data.hoverImage);
    }

    return await apiClient.put(`/TeamMembers/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const deleteMember = async (id: string) => {
    return await apiClient.delete(`/TeamMembers/${id}`);
};

export const memberService = {
    memberCreate,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
};
