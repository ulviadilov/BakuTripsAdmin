import { apiClient } from "../../utils/axiosInstance";
import type {
  OrdersGetAllParams,
  OrdersGetAllResponse,
  OrderDetail,
} from "./types";

export async function getOrders({
  page = 0,
  size = 10,
  search = "",
}: OrdersGetAllParams) {
  const qp = new URLSearchParams();
  qp.set("page", String(page));
  qp.set("size", String(size));
  if (search) qp.set("search", search);
  return await apiClient.get<OrdersGetAllResponse>(
    `/Orders/get-all?${qp.toString()}`
  );
}

export async function getOrderById(id: string) {
  return await apiClient.get<{ order: OrderDetail }>(`/Orders/get-by-id/${id}`);
}

export async function changeOrderStatus(orderId: string, newStatus: string) {
  return await apiClient.put(`/Orders/change-status/${orderId}`, { status: newStatus });
}

export async function refundOrderItem(orderId: string, itemId: string) {
  return await apiClient.post(
    `/Orders/refund-item?orderId=${orderId}&itemId=${itemId}`
  );
}

export const ordersService = {
  getOrders,
  getOrderById,
  changeOrderStatus,
  refundOrderItem,
};
