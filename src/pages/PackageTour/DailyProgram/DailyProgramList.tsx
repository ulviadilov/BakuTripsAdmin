import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paths } from "../../../constants/path";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { dailyProgramService } from "../../../services/packageTour/dailyProgram";
import type { RowType } from "../../../types";
import Spinner from "../../../components/Spinner";
import { ErrorMessage } from "../../../components/Error";
import { Table } from "../../../components/Table";
import { DeleteConfirmationModal } from "../../../components/Modal";


const columns = [
    {
        key: "title",
        label: "Title",
        type: "text" as const,
    },
];

export default function DailyProgramList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    const handleCreate = () => {
        navigate(paths.PACKAGE_DAILY_PROGRAM.CREATE);
    };

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.packageDailyProgram.all, paginationData],
        queryFn: () => dailyProgramService.getAllDailyPrograms(paginationData.skip, paginationData.take)
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.PACKAGE_DAILY_PROGRAM.EDIT(row.id));
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
        mutationFn: (id: string) => dailyProgramService.deleteDailyProgram(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.packageDailyProgram.all] });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Daily program deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete daily program:", error);
            toast.error("Failed to delete daily program");
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading daily programs..." />
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

    const programs = data?.data?.dailyPrograms;
    const totalCount = data?.data?.totalCount || 0;
    const paginationProps = {
        totalCount: totalCount,
        skip: paginationData.skip,
        take: paginationData.take,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={programs}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Daily Program"
                    title="Daily Programs"
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
                type="daily program"
            />
        </>
    );
}
