
import { useNavigate } from "react-router";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paths } from "../../../constants/path";
import type { RowType } from "../../../types";
import Spinner from "../../../components/Spinner";
import { ErrorMessage } from "../../../components/Error";
import { Table } from "../../../components/Table";
import { DeleteConfirmationModal } from "../../../components/Modal";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { privateTourService } from "../../../services/privateTour";

const columns = [
    {
        key: "tourName",
        label: "Tour Name",
        type: "text" as const,
    },
    {
        key: "vehicleInfo",
        label: "Vehicle Info",
        type: "text" as const,
    },
    {
        key: "price",
        label: "Price",
        type: "text" as const,
    },
];

export default function PrivatePackageList() {
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
    const handleCreate = () => {
        navigate(paths.PRIVATE_PACKAGE.CREATE);
    };

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.privateTour.packages, paginationData],
        queryFn: () => privateTourService.getAllPrivatePackages(paginationData.skip, paginationData.take),
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.PRIVATE_PACKAGE.EDIT(row.id)); // Adjust path as needed
    };

    const handleDelete = (row: RowType) => {
        setDeleteModal({
            isOpen: true,
            name: row,
        });
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
        mutationFn: (id: string) => privateTourService.deletePackage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.privateTour.packages]});
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Package deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete tour:", error);
            toast.error("Failed to delete tour");
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading tours..." />
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

    const { privateTourPackages, totalCount } = data?.data;
    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={privateTourPackages}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Package"
                    title="Packages"
                    actions={true}
                    columns={columns}
                    pagination={paginationProps}
                    onPageChange={handlePageChange}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.vehicleInfo || ""}
                isDeleting={deleteMutation.isPending}
                type="tour"
            />
        </>
    );
}
