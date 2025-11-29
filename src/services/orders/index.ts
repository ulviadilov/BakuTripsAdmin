import { apiClient } from "../../utils/axiosInstance";
import type { OrdersGetAllParams, OrdersGetAllResponse, OrderDetail } from "./types";

export async function getOrders({ page = 0, size = 10, search = "" }: OrdersGetAllParams) {
  const qp = new URLSearchParams();
  qp.set("page", String(page));
  qp.set("size", String(size));
  if (search) qp.set("search", search);
  return await apiClient.get<OrdersGetAllResponse>(`/Orders/get-all?${qp.toString()}`);
}

export async function getOrderById(id: string) {
  return await apiClient.get<{ order: OrderDetail }>(`/Orders/get-by-id/${id}`);
}

export const ordersService = {
  getOrders,
  getOrderById,
};
