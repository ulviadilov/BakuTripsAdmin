import { apiClient } from "../../utils/axiosInstance";
import type { PartnerRequestsListResponse, PartnerRequestDetailResponse } from "./types";

const getAll = async () => {
  return apiClient.get<PartnerRequestsListResponse>("/Partners/get-all-partnership-requests");
};

const getById = async (id: string) => {
  return apiClient.get<PartnerRequestDetailResponse>(`/Partners/get-partner-request-by-${id}`);
};

export const partnerRequestsService = {
  getAll,
  getById,
};
