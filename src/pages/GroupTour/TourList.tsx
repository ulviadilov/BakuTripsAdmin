import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paths } from "../../constants/path";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { groupTourService } from "../../services/groupTour";
import type { RowType, TourFormData } from "../../types";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { Table } from "../../components/Table";
import { DeleteConfirmationModal } from "../../components/Modal";


const columns= [
    {
        key: "name",
        label: "Tour Name",
        type: "text"
    },
    {
        key: "duration",
        label: "Duration",
        type: "text" as const,
    },
    {
        key: "isPopular",
        label: "Popular",
        type: "text" as const,
    },
    {
        key: "posterImagePath",
        label: "Poster Image",
        type: "image" as const,
    },
];

export default function TourList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleCreate = () => {
        navigate(paths.GROUP_TOUR.CREATE); // Adjust path as needed
    };

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.groupTour],
        queryFn: () => groupTourService.getAllTours(0,10)
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.GROUP_TOUR.EDIT(row.id));
    };
    const handleRowClick = (row: RowType) => {
        navigate(paths.GROUP_TOUR.DETAIL(row.id));
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
        mutationFn: (id: string) => groupTourService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.groupTour] });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Tour deleted successfully");
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

    const tours = data?.data?.grouptours;
        const updatedItems = tours.map((tour:TourFormData) => ({
            ...tour,
            isPopular: tour.isPopular ? (
                <span className="bg-green-500 py-1 px-2.5 rounded-3xl text-white">
                    Popular
                </span>
            ) : (
                <span className="bg-red-500 py-1 px-2.5 rounded-3xl text-white">
                    Not Popular
                </span>
            ),
        }));

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={updatedItems}
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
                    onView={handleRowClick}
                    onDelete={handleDelete}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.name || ""}
                isDeleting={deleteMutation.isPending}
                type="tour"
            />
        </>
    );
}
