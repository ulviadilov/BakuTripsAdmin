import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../../services/orders";
import { QUERY_KEYS } from "../../constants/queryKeys";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { useNavigate } from "react-router";
import { Table } from "../../components/Table";

const columns = [
    { key: "orderNumber", label: "Order #", type: "text" as const },
    { key: "customerName", label: "Customer Name", type: "text" as const },
    { key: "customerSurname", label: "Customer Surname", type: "text" as const },
    { key: "status", label: "Status", type: "text" as const },
    { key: "totalAmount", label: "Total", type: "text" as const },
    { key: "orderItemsCount", label: "Items", type: "text" as const },
    { key: "usedPromocode", label: "Promo", type: "text" as const },
    { key: "createdDate", label: "Created", type: "text" as const },
];

export default function OrdersList() {
    const navigate = useNavigate();
    const [skip, setSkip] = useState(0); // zero-based page index
    const [take, setTake] = useState(10);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [...QUERY_KEYS.orders.all, skip, take, search],
        queryFn: () => ordersService.getOrders({ page: skip, size: take, search }),
    });

    const rows = (data?.data.orders ?? []).map((r: any) => ({
        id: r.id,
        orderNumber: r.orderNumber,
        status: r.status === "Paid" ? (
            <span className="bg-green-500 py-1 px-2.5 rounded-3xl text-white">
                Paid
            </span>
        ) : r.status === "Refunded" ? (
            <span className="bg-red-500 py-1 px-2.5 rounded-3xl text-white">
                Refunded
            </span>
        ) : null,
        totalAmount: r.totalAmount,
        orderItemsCount: r.orderItemsCount,
        customerName: r.customerName,
        customerSurname: r.customerSurname,
        usedPromocode: r.usedPromocode || "-",
        createdDate: new Date(r.createdDate).toLocaleString(),
    }));

    const totalCount = data?.data.totalCount ?? 0;

    const handleRetry = () => refetch();

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading orders..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <ErrorMessage onRetry={handleRetry} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Table
                data={rows}
                creatable={false}
                searchable={true}
                searchOnButton={true}
                title="Orders"
                actions={false}
                columns={columns}
                pagination={{ totalCount, skip, take }}
                onPageChange={(newSkip, newTake) => {
                    setSkip(newSkip);
                    setTake(newTake);
                }}
                onSearch={(term) => {
                    setSearch(term);
                    setSkip(0);
                }}
                onRowClick={(row) => navigate(`/orders/detail/${row.id}`)}
            />
        </div>
    );
}
