import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { categoryService } from "../../services/category";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { useCallback, useState } from "react";
import { DeleteConfirmationModal } from "../../components/Modal";
import toast from "react-hot-toast";

const columns = [
    {
        key: "name",
        label: "Category Name",
        type: "text" as const,
    },
];

interface RowType {
    [key: string]: any;
    id: string;
}

export default function CategoryList() {
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
    }, [paginationData.skip,paginationData.take]);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.category,paginationData.skip,paginationData.take],
        queryFn: () => categoryService.getAll(paginationData.skip,paginationData.take),
    });

    const deleteMutation = useMutation({
        mutationFn: (categoryId: string) =>
            categoryService.deleteCategory(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.category] });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Category deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete category:", error);
        },
    });

    const handleDelete = (row: RowType) => {
        setDeleteModal({
            isOpen: true,
            name: row,
        });
    };

    const handleCreate = () => {
        navigate(paths.CATEGORY.CREATE);
    };

    const handleEdit = (row: RowType) => {
        navigate(`${paths.CATEGORY.EDIT(row.id)}`);
    };

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

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading categories..." />
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

    const { categories, totalCount } = data?.data;
    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    columns={columns}
                    data={categories}
                    creatable={true}
                    createButtonText="Create New Category"
                    title="Tour Categories"
                    searchable={false}
                    actions={true}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    pagination={paginationProps}
                    onPageChange={handlePageChange}
                    onSearch={(data) => {
                        console.log(data);
                    }}
                />
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.name || ""}
                isDeleting={deleteMutation.isPending}
                type="category"
            />
        </>
    );
}
