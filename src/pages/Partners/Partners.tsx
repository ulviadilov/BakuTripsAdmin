import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { partnerService } from "../../services/partners";
import { DeleteConfirmationModal } from "../../components/Modal";
import { ErrorMessage } from "../../components/Error";
import toast from "react-hot-toast";
import type { RowType } from "../../types";
import Spinner from "../../components/Spinner";

const columns = [
    {
        key: "logoImagePath",
        label: "Logo",
        type: "image" as const,
        imageSize: "small" as const,
    },
    {
        key: "companyName",
        label: "Company Name",
        type: "text" as const,
    },
];

export default function PartnersList() {
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
        navigate(paths.PARTNERS.CREATE);
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.partner.all],
        queryFn: () => partnerService.getAllPartners(0, 10),
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
        mutationFn: (id: string) => partnerService.deletePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.partner.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Partner deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete partner");
            console.error("Failed to delete partner:", error);
        },
    });

    const handleEdit = (row: RowType) => {
        navigate(paths.PARTNERS.EDIT(row.id));
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading Partners..." />
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

     const {partnerLogos,totalCount} = data?.data;

    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={partnerLogos}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Partner"
                    title="Partners"
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
                name={deleteModal.name?.companyName || ""}
                isDeleting={deleteMutation.isPending}
                type="destination"
            />
        </>
    );
}
