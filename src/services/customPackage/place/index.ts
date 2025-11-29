import { apiClient } from "../../../utils/axiosInstance";
import type {
  CreateCustomPlacePayload,
  UpdateCustomPlacePayload,
  CustomPlacesListResponse,
  CustomPlaceDetailResponse,
} from "./types";

const createPlace = async (data: CreateCustomPlacePayload) => {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.placeImage) {
    formData.append("placeImage", data.placeImage);
  }
  if (data.translations && Array.isArray(data.translations)) {
    data.translations.forEach((tr, i) => {
      formData.append(`translations[${i}].name`, tr.name);
      formData.append(`translations[${i}].languageCode`, tr.languageCode);
    });
  }
  return apiClient.post("/CustomPackages/create-place", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updatePlace = async (id: string, data: UpdateCustomPlacePayload) => {
  const formData = new FormData();
  formData.append("Name", data.Name);
  if (data.PlaceImage) {
    formData.append("PlaceImage", data.PlaceImage);
  }
  if (data.Translations && Array.isArray(data.Translations)) {
    data.Translations.forEach((tr, i) => {
      formData.append(`Translations[${i}].name`, tr.name);
      formData.append(`Translations[${i}].languageCode`, tr.languageCode);
    });
  }
  return apiClient.put(`/CustomPackages/update-place-${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deletePlace = async (id: string) => {
  return apiClient.delete(`/CustomPackages/delete-place-${id}`);
};

const getAllPlaces = async (page: number, size: number) => {
  return apiClient.get<CustomPlacesListResponse>(`/CustomPackages/get-all-places?page=${page}&size=${size}`);
};

const getPlaceById = async (id: string) => {
  return apiClient.get<CustomPlaceDetailResponse>(`/CustomPackages/${id}?includeAllTranslations=true`);
};

export const customPlaceService = {
  createPlace,
  updatePlace,
  deletePlace,
  getAllPlaces,
  getPlaceById,
};
