import { apiClient } from "../../utils/axiosInstance";
import type { BlogListResponse, BlogRequestPayload, BlogResponseItem } from "./types";

async function getAll(page: number = 0, size: number = 10) {
  return await apiClient.get<BlogListResponse>(`/Blogs/get-all?page=${page}&size=${size}`);
}

async function getById(id: string) {
  // include all translations for edit/detail forms
  return await apiClient.get<{ blog: BlogResponseItem }>(`/Blogs/get-by-id?id=${id}&includeAllTranslations=true`);
}

async function create(payload: BlogRequestPayload) {
  const formData = new FormData();
  formData.append("AuthorName", payload.AuthorName);
  formData.append("MainTitle", payload.MainTitle);
  formData.append("MainDescription", payload.MainDescription);
  if (payload.SubTitle) formData.append("SubTitle", payload.SubTitle);
  if (payload.SubDescription) formData.append("SubDescription", payload.SubDescription);
  if (payload.FirstImageFile) formData.append("FirstImageFile", payload.FirstImageFile);
  if (payload.SecondImageFile) formData.append("SecondImageFile", payload.SecondImageFile);
  if (payload.FirstVideoUrl) formData.append("FirstVideoUrl", payload.FirstVideoUrl);
  if (payload.SecondVideoUrl) formData.append("SecondVideoUrl", payload.SecondVideoUrl);
  if (payload.Translations && payload.Translations.length > 0) {
    payload.Translations.forEach((tr, i) => {
      formData.append(`Translations[${i}].languageCode`, tr.languageCode);
      if (tr.mainTitle) formData.append(`Translations[${i}].mainTitle`, tr.mainTitle);
      if (tr.mainDescription) formData.append(`Translations[${i}].mainDescription`, tr.mainDescription);
      if (tr.subTitle) formData.append(`Translations[${i}].subTitle`, tr.subTitle);
      if (tr.subDescription) formData.append(`Translations[${i}].subDescription`, tr.subDescription);
    });
  }

  return await apiClient.post("/Blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function update(id: string, payload: BlogRequestPayload) {
  const formData = new FormData();
  formData.append("AuthorName", payload.AuthorName);
  formData.append("MainTitle", payload.MainTitle);
  formData.append("MainDescription", payload.MainDescription);
  if (payload.SubTitle) formData.append("SubTitle", payload.SubTitle);
  if (payload.SubDescription) formData.append("SubDescription", payload.SubDescription);
  if (payload.FirstImageFile) formData.append("FirstImageFile", payload.FirstImageFile);
  if (payload.SecondImageFile) formData.append("SecondImageFile", payload.SecondImageFile);
  if (payload.FirstVideoUrl) formData.append("FirstVideoUrl", payload.FirstVideoUrl);
  if (payload.SecondVideoUrl) formData.append("SecondVideoUrl", payload.SecondVideoUrl);
  if (payload.Translations && payload.Translations.length > 0) {
    payload.Translations.forEach((tr, i) => {
      formData.append(`Translations[${i}].languageCode`, tr.languageCode);
      if (tr.mainTitle) formData.append(`Translations[${i}].mainTitle`, tr.mainTitle);
      if (tr.mainDescription) formData.append(`Translations[${i}].mainDescription`, tr.mainDescription);
      if (tr.subTitle) formData.append(`Translations[${i}].subTitle`, tr.subTitle);
      if (tr.subDescription) formData.append(`Translations[${i}].subDescription`, tr.subDescription);
    });
  }

  return await apiClient.put(`/Blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function remove(id: string) {
  return await apiClient.delete(`/Blogs/${id}`);
}

export const blogsService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
