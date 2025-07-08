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
import { sliderService } from "../../services/slider";

const columns = [
    {
        key: "title",
        label: "Title",
        type: "text" as const,
    },
    {
        key: "subTitle",
        label: "Sub Title",
        type: "text" as const,
    },
    {
        key: "backgroundImagePath",
        label: "Background Image",
        type: "image" as const,
        size:"small" as const
    },
];

export default function SliderList() {
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
        navigate(paths.SLIDER.CREATE);
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.slider.all],
        queryFn: () => sliderService.getAll(paginationData.skip,paginationData.take),
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
        mutationFn: (id: string) => sliderService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.slider.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Slider deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete slider");
            console.error("Failed to delete slider:", error);
        },
    });

    const handleEdit = (row: RowType) => {
        navigate(paths.SLIDER.EDIT(row.id));
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading Slider..." />
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

     const {sliders,totalCount} = data?.data;

    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={sliders}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Slider"
                    title="Sliders"
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
                name={deleteModal.name?.title || ""}
                isDeleting={deleteMutation.isPending}
                type="destination"
            />
        </>
    );
}
