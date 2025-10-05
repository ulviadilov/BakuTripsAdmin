import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paths } from "../../constants/path";
import { QUERY_KEYS } from "../../constants/queryKeys";
import type { RowType, TourFormData } from "../../types";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { Table } from "../../components/Table";
import { DeleteConfirmationModal } from "../../components/Modal";
import { packageTourService } from "../../services/packageTour";

const columns = [
    {
        key: "title",
        label: "Title",
        type: "text" as const,
    },
    {
        key: "duration",
        label: "Duration",
        type: "text" as const,
    },
    {
        key: "basePrice",
        label: "Base Price",
        type: "text" as const
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
        navigate(paths.PACKAGE_TOUR_PACKAGE.CREATE); // Adjust path as needed
    };

    const [paginationData, setPaginationData] = useState({
        skip: 0,
        take: 10,
    });

    const handlePageChange = (skip: number, take: number) => {
        setPaginationData({
            skip: skip || 0,
            take: take || 10,
        });
    }

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.package, paginationData],
        queryFn: () => packageTourService.getAllPackages(paginationData.skip, paginationData.take)
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.PACKAGE_TOUR_PACKAGE.EDIT(row.id));
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
        mutationFn: (id: string) => packageTourService.deletePackage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.package] });
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

    const tours = data?.data?.travelPackages;
    const totalCount = data?.data?.totalCount || 0;
    const updatedItems = tours.map((tour: TourFormData) => ({
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

    const paginationProps = {
        totalCount: totalCount,
        skip: paginationData.skip,
        take: paginationData.take,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={updatedItems || []}
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
                name={deleteModal.name?.title || ""}
                isDeleting={deleteMutation.isPending}
                type="tour"
            />
        </>
    );
}
