import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { paths } from "../../constants/path";
import { useCallback, useState } from "react";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { destinationService } from "../../services/destination";
import type { RowType } from "../../types";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { DeleteConfirmationModal } from "../../components/Modal";
import { Table } from "../../components/Table";

const columns = [
    {
        key: "name",
        label: "Name",
        type: "text" as const,
    },
    {
        key: "duration",
        label: "Duration",
        type: "text" as const,
    },
    {
        key: "description",
        label: "Description",
        type: "text" as const,
    },
    {
        key: "imageFile",
        label: "Image",
        type: "image" as const,
        imageSize: "medium" as const,
    },
];

export default function DestinationList() {
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
        navigate(paths.DESTINATION.CREATE);
    };
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.destination.all],
        queryFn: () => destinationService.getAll(0, 10),
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.DESTINATION.EDIT(row.id));
    };

    const handleDelete = (row: RowType) => {
        setDeleteModal({
            isOpen: true,
            name: row,
        });
    };

    // const handleRowClick = (row:RowType)=>{
    //     navigate(paths.DESTINATION.DETAIL(row.id))
    // }
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
        mutationFn: (id: string) => destinationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.destination.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Destionation deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete destination");
            console.error("Failed to delete destination:", error);
        },
    });
    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading destinations..." />
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


    const {destinations,totalCount} = data?.data;

    const paginationProps = {
        skip:paginationData.skip,
        take:paginationData.take,
        totalCount:totalCount
    }

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={destinations}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Destination"
                    title="Destinations"
                    onPageChange={handlePageChange}
                    actions={true}
                    columns={columns}
                    pagination={paginationProps}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    // onRowClick={handleRowClick}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.name || ""}
                isDeleting={deleteMutation.isPending}
                type="destination"
            />
        </>
    );
}
