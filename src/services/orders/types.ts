export type OrderStatus = "Paid" | "Pending" | "Cancelled" | string;

export interface OrderListItem {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  orderItemsCount: number;
  usedPromocode: string | null | undefined;
  orderItemsImagePaths: string[];
  createdDate: string; // ISO string
}

export interface OrdersGetAllResponse {
  orders: OrderListItem[];
  totalCount: number;
}

export interface OrdersGetAllParams {
  page?: number; // zero-based
  size?: number;
  search?: string;
}

export interface OrderDetail extends OrderListItem {
  // extend later if backend returns more fields
}
