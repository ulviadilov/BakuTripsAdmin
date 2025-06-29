import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paths } from "../../../constants/path";
import type { RowType } from "../../../types";
import { DeleteConfirmationModal } from "../../../components/Modal";
import { Table } from "../../../components/Table";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { packageOptionService } from "../../../services/packageTour/option";
import Spinner from "../../../components/Spinner";
import { ErrorMessage } from "../../../components/Error";
const columns = [
    {
        key: "optionName",
        label: "Option Name",
        type: "text" as const,
    },
    {
        key: "price",
        label: "Price",
        type: "text" as const,
    },
    {
        key: "roomInfo",
        label: "Room Info",
        type: "text" as const,
    },
    {
        key: "vehicleInfo",
        label: "Vehicle Info",
        type: "text" as const,
    },
];

export default function TourOptionList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleCreate = () => {
        navigate(paths.PACKAGE_TOUR_OPTION.CREATE);
    };

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.packageOption],
        queryFn: () => packageOptionService.getAllOptions(0,10)
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.PACKAGE_TOUR_OPTION.EDIT(row.id));
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
        mutationFn: (id: string) => packageOptionService.deleteOption(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packageOption.all] });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Package Option deleted successfully");
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

    const handleRowClick = (row:RowType)=>{
        navigate(paths.PACKAGE_TOUR_OPTION.DETAIL(row.id))
    }
    const packages = data?.data?.packageOptions;

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={packages}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Tour"
                    title="Tours"
                    actions={true}
                    columns={columns}
                    pagination={{
                        totalCount: data?.data.totalCount || 0,
                        skip: 0,
                        take: 10,
                    }}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.optionName || ""}
                isDeleting={deleteMutation.isPending}
                type="tour"
            />
        </>
    );
}
