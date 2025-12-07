import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../../services/orders";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { paths } from "../../constants/path";
import { StatusChangeModal, RefundItemModal } from "../../components/Modal";
import toast from "react-hot-toast";
import { useState } from "react";

interface OrderItemDetail {
  id: string;
  orderId: string;
  tourId: string;
  totalPrice: number;
  message: string;
  pickupLocation: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  vehicleInfo: string;
  tourDate: string;
  orderItemType: string;
  posterImagePath?: string;
  tourName: string;
  guideLanguage?: string;
  guidePrice?: number;
}

interface OrderDetailResponseShape {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  usedPromoCode?: string | null;
  totalGuidePrice?: number;
  orderItems: OrderItemDetail[];
}

function formatMoney(n: number | undefined | null) {
  if (n === undefined || n === null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(iso: string | undefined) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    currentStatus: string;
    newStatus: string;
  }>({
    isOpen: false,
    currentStatus: "",
    newStatus: "",
  });
  const [refundItemModal, setRefundItemModal] = useState<{
    isOpen: boolean;
    itemId: string;
    tourName: string;
  }>({
    isOpen: false,
    itemId: "",
    tourName: "",
  });

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.orders.detail(id || ""),
    queryFn: () => ordersService.getOrderById(id || ""),
    enabled: !!id,
  });

  const statusChangeMutation = useMutation({
    mutationFn: (newStatus: string) => ordersService.changeOrderStatus(id || "", newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id || "") });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      setStatusModal({ isOpen: false, currentStatus: "", newStatus: "" });
      toast.success("Order status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  const handleStatusChange = (currentStatus: string, newStatus: string) => {
    setStatusModal({
      isOpen: true,
      currentStatus,
      newStatus,
    });
  };

  const handleConfirmStatusChange = () => {
    statusChangeMutation.mutate(statusModal.newStatus);
  };

  const refundItemMutation = useMutation({
    mutationFn: (itemId: string) => ordersService.refundOrderItem(id || "", itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id || "") });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      setRefundItemModal({ isOpen: false, itemId: "", tourName: "" });
      toast.success("Item refunded successfully");
    },
    onError: () => {
      toast.error("Failed to refund item");
    },
  });

  const handleRefundItem = (itemId: string, tourName: string) => {
    setRefundItemModal({
      isOpen: true,
      itemId,
      tourName,
    });
  };

  const handleConfirmRefundItem = () => {
    refundItemMutation.mutate(refundItemModal.itemId);
  };

  const handleBack = () => {
    navigate(paths.ORDERS.LIST);
  };

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 text-lg font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Order</h2>
          <p className="text-gray-600 mb-6">There was an error loading the order details.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={handleBack} className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <button onClick={() => refetch()} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Backend might return either { order: {...} } or flat object. Try both.
  const payload: any = data?.data;
  const order: OrderDetailResponseShape | undefined = (payload?.order ? payload.order : payload) as OrderDetailResponseShape | undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The requested order could not be found.</p>
          <button onClick={handleBack} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={handleBack} className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Back to orders">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-200' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  Order Date: <span className="font-medium">{formatDate(order.orderDate)}</span>
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  const newStatus = order.status === "Paid" ? "Refund" : "Paid";
                  handleStatusChange(order.status, newStatus);
                }}
                className="inline-flex items-center px-5 py-2.5 bg-primary cursor-pointer text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Refund Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Payment Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Payment Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-500">Total</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatMoney(order.totalAmount)}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-500">Discount</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">-{formatMoney(order.discountAmount)}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-500">Guide</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatMoney(order.totalGuidePrice ?? 0)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-white/90">Final Amount</p>
              </div>
              <p className="text-2xl font-bold text-white">{formatMoney(order.finalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Customer & Stats */}
          <div className="lg:col-span-1 space-y-5">
            {/* Customer Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Customer Details</h2>
              </div>
              <div className="space-y-4 mt-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs font-medium text-blue-600 mb-1">👤 Customer Name</p>
                  <p className="text-lg font-bold text-gray-900">{order.customerName} {order.customerSurname}</p>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900 break-all">{order.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Order Statistics</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3.5 text-center border-2 border-blue-200 hover:shadow-md transition-shadow">
                  <p className="text-xs text-blue-700 font-semibold mb-1">📦 Items</p>
                  <p className="text-3xl font-bold text-blue-900">{order.orderItems.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3.5 text-center border-2 border-green-200 hover:shadow-md transition-shadow">
                  <p className="text-xs text-green-700 font-semibold mb-1">👨 Adults</p>
                  <p className="text-3xl font-bold text-green-900">{order.orderItems.reduce((a,i)=>a+i.adultCount,0)}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3.5 text-center border-2 border-amber-200 hover:shadow-md transition-shadow">
                  <p className="text-xs text-amber-700 font-semibold mb-1">👦 Children</p>
                  <p className="text-3xl font-bold text-amber-900">{order.orderItems.reduce((a,i)=>a+i.childCount,0)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3.5 text-center border-2 border-purple-200 hover:shadow-md transition-shadow">
                  <p className="text-xs text-purple-700 font-semibold mb-1">👶 Infants</p>
                  <p className="text-3xl font-bold text-purple-900">{order.orderItems.reduce((a,i)=>a+i.infantCount,0)}</p>
                </div>
              </div>
              {order.usedPromoCode && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 mb-2.5 flex items-center gap-1.5">
                    <span>🎟️</span> Promo Code Applied
                  </p>
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg px-4 py-2.5 shadow-sm">
                    <p className="text-base font-bold text-pink-800 text-center tracking-wide">{order.usedPromoCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Order Items ({order.orderItems.length})</h2>
              </div>

              {order.orderItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm">No items in this order</p>
                </div>
              ) : (
                <div className="space-y-3.5 mt-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all group">
                      {/* Item Number Badge */}
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 flex items-center justify-between">
                        <p className="text-xs font-bold text-white tracking-wide">ITEM #{idx + 1}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefundItem(item.id, item.tourName);
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition-colors flex items-center gap-1.5"
                          title="Refund this item"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Refund
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row">
                        {item.posterImagePath && (
                          <div className="sm:w-44 flex-shrink-0 overflow-hidden bg-gray-100">
                            <img src={item.posterImagePath} alt={item.tourName} className="w-full h-36 sm:h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{item.tourName}</h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-300 shadow-sm">
                                {item.orderItemType}
                              </span>
                            </div>
                            <div className="text-right ml-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl px-4 py-2.5 shadow-sm">
                              <p className="text-[10px] text-green-700 font-bold uppercase tracking-wide mb-0.5">Total Price</p>
                              <p className="text-2xl font-black text-green-800">{formatMoney(item.totalPrice)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg px-3 py-2.5 text-center hover:shadow-md transition-shadow">
                              <p className="text-[10px] text-indigo-700 font-bold uppercase mb-1">📅 Tour Date</p>
                              <p className="text-xs font-bold text-indigo-900">{new Date(item.tourDate).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg px-3 py-2.5 text-center hover:shadow-md transition-shadow">
                              <p className="text-[10px] text-blue-700 font-bold uppercase mb-1">👨 Adults</p>
                              <p className="text-xl font-black text-blue-900">{item.adultCount}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg px-3 py-2.5 text-center hover:shadow-md transition-shadow">
                              <p className="text-[10px] text-amber-700 font-bold uppercase mb-1">👦 Children</p>
                              <p className="text-xl font-black text-amber-900">{item.childCount}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg px-3 py-2.5 text-center hover:shadow-md transition-shadow">
                              <p className="text-[10px] text-purple-700 font-bold uppercase mb-1">👶 Infants</p>
                              <p className="text-xl font-black text-purple-900">{item.infantCount}</p>
                            </div>
                          </div>

                          {(item.guideLanguage || item.guidePrice !== undefined) && (
                            <div className="flex flex-wrap gap-2.5 mb-3 pb-3 border-b border-gray-100">
                              {item.guideLanguage && (
                                <div className="flex items-center px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs hover:shadow-sm transition-shadow">
                                  <svg className="w-3.5 h-3.5 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                  </svg>
                                  <span className="text-teal-700 font-semibold">Language:</span>
                                  <span className="font-black text-teal-900 ml-1.5">{item.guideLanguage}</span>
                                </div>
                              )}
                              {item.guidePrice !== undefined && (
                                <div className="flex items-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs hover:shadow-sm transition-shadow">
                                  <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-emerald-700 font-semibold">Guide:</span>
                                  <span className="font-black text-emerald-900 ml-1.5">{formatMoney(item.guidePrice)}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {item.pickupLocation && (
                            <div className="mb-2.5">
                              <div className="flex items-start px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-xs hover:shadow-sm transition-shadow">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                  <span className="text-orange-700 font-semibold">📍 Pickup: </span>
                                  <span className="text-orange-900 font-medium">{item.pickupLocation}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {item.message && (
                            <div className="mb-2.5">
                              <div className="flex items-start px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs hover:shadow-sm transition-shadow">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <div>
                                  <span className="text-blue-700 font-semibold">💬 Message: </span>
                                  <span className="text-blue-900 font-medium">{item.message}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {item.vehicleInfo && item.vehicleInfo.trim() !== "" && (
                            <div className="text-xs">
                              <div className="flex items-start px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                <div>
                                  <span className="text-slate-700 font-semibold">🚗 Vehicle: </span>
                                  <span className="text-slate-900 font-medium">{item.vehicleInfo}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <StatusChangeModal
        isOpen={statusModal.isOpen}
        onClose={() => {
          if (!statusChangeMutation.isPending) {
            setStatusModal({ isOpen: false, currentStatus: "", newStatus: "" });
          }
        }}
        onConfirm={handleConfirmStatusChange}
        orderNumber={order.orderNumber}
        currentStatus={statusModal.currentStatus}
        newStatus={statusModal.newStatus}
        isChanging={statusChangeMutation.isPending}
      />
      <RefundItemModal
        isOpen={refundItemModal.isOpen}
        onClose={() => {
          if (!refundItemMutation.isPending) {
            setRefundItemModal({ isOpen: false, itemId: "", tourName: "" });
          }
        }}
        onConfirm={handleConfirmRefundItem}
        tourName={refundItemModal.tourName}
        isRefunding={refundItemMutation.isPending}
      />
    </div>
  );
}
