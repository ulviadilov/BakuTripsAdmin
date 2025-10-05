import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { DeleteConfirmationModal } from "../../components/Modal";
import { ErrorMessage } from "../../components/Error";
import toast from "react-hot-toast";
import type { RowType } from "../../types";
import Spinner from "../../components/Spinner";
import { promoService } from "../../services/promo";
import type { PromoCodeRespone } from "../../services/promo/types";

const columns = [
    {
        key: "code",
        label: "Promo Code",
        type: "text" as const,
    },
    {
        key: "discountPercent",
        label: "Discount Percentage",
        type: "text" as const,
    },
    {
        key: "isActive",
        label: "Status",
        type: "text" as const,
    },
    {
        key: "maxUsageCount",
        label: "Maximum Usage Count",
        type: "text" as const,
    },
    {
        key: "minOrderAmount",
        label: "Minimum Order Amount",
        type: "text" as const,
    },
    {
        key: "maxDiscountAmount",
        label: "Maximum Discount Amount",
        type: "text" as const,
    },
];

export default function PromoCodeList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [paginationData, setPaginationData] = useState({
        skip: 0,
        take: 10,
    });
    const handlePageChange = useCallback((skip: number, take: number) => {
        setPaginationData({
            skip: skip || 0,
            take: take || 10,
        });
    }, []);
    const handleDelete = (row: any) => {
        setDeleteModal({
            isOpen: true,
            name: row,
        });
    };
    const handleCreate = () => {
        navigate(paths.PROMO_CODES.CREATE);
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.promoCode.all, paginationData],
        queryFn: () =>
            promoService.getAll(paginationData.skip, paginationData.take),
    });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const handleRetry = () => {
        refetch();
    };

    const handleConfirmDelete = () => {
        if (deleteModal.name) {
            deleteMutation.mutate(deleteModal.name.id);
        }
    };

    const handleCloseModal = () => {
        if (!deleteMutation.isPending) {
            setDeleteModal({ isOpen: false, name: null });
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => promoService.deletePromoCode(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.promoCode.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Promo code deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete promo code");
            console.error("Failed to delete promo code:", error);
        },
    });

    const handleEdit = (row: RowType) => {
        navigate(paths.PROMO_CODES.EDIT(row.id));
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading Promo codes..." />
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

    const promoCodes = data?.data?.promoCodes || [];
    const totalCount = data?.data?.totalCount || 0;

    const updatedPromo = promoCodes.map(
        (promoCode: PromoCodeRespone["promoCodes"][number]) => ({
            ...promoCode,
            isActive: promoCode.isActive ? (
                <span className="bg-green-500 py-1 px-2.5 rounded-3xl text-white">
                    Active
                </span>
            ) : (
                <span className="bg-red-500 py-1 px-2.5 rounded-3xl text-white">
                    Inactive
                </span>
            ),
        })
    );

    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={updatedPromo}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Promo Code"
                    title="Promo Codes"
                    onPageChange={handlePageChange}
                    actions={true}
                    columns={columns}
                    pagination={paginationProps}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.code || ""}
                isDeleting={deleteMutation.isPending}
                type="Promo Code"
            />
        </>
    );
}
