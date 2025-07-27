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
import { guideService } from "../../services/guide";

const columns = [
    {
        key: "language",
        label: "Language",
        type: "text" as const,
    },
    {
        key: "price",
        label: "Price",
        type: "text" as const,
    },
];

export default function GuideList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleDelete = (row: any) => {
        setDeleteModal({
            isOpen: true,
            name: row,
        });
    };

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
        navigate(paths.GUIDE.CREATE);
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.guide.all,paginationData.skip,paginationData.take],
        queryFn: () =>
            guideService.getAll(paginationData.skip, paginationData.take),
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
        mutationFn: (id: string) => guideService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.guide.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Guide deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete guide");
            console.error("Failed to delete guide:", error);
        },
    });

    const handleEdit = (row: RowType) => {
        navigate(paths.GUIDE.EDIT(row.id));
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading Guides..." />
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
    const { totalCount, tourGuides } = data?.data;

    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={tourGuides}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Guide"
                    title="Guides"
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
                name={deleteModal.name?.language || ""}
                isDeleting={deleteMutation.isPending}
                type="destination"
            />
        </>
    );
}
