import { useNavigate } from "react-router";
import { Table } from "../../../components/Table";
import { paths } from "../../../constants/path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { contactService } from "../../../services/settings/contact";
import Spinner from "../../../components/Spinner";
import { ErrorMessage } from "../../../components/Error";
import type { RowType } from "../../../types";
import { DeleteConfirmationModal } from "../../../components/Modal";
import { useState } from "react";
import toast from "react-hot-toast";

const columns = [
    {
        key: "corporateNumber",
        label: "Corporate Number",
        type: "text" as const,
    },
    {
        key: "corporateMail",
        label: "Corporate Email",
        type: "text" as const,
    },
    {
        key: "location",
        label: "Location",
        type: "text" as const,
    },
    {
        key: "workingHours",
        label: "Working Hours",
        type: "text" as const,
    },
];

export default function ContactList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const handleCreate = () => {
        navigate(paths.SETTING.CONTACT.CREATE);
    };
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        name: any;
    }>({
        isOpen: false,
        name: null,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.contact],
        queryFn: () => contactService.getAll(),
    });

    const handleRetry = () => {
        refetch();
    };

    const handleEdit = (row: RowType) => {
        navigate(paths.SETTING.CONTACT.EDIT(row.id));
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

    const handleRowClick = (row:RowType)=>{
        navigate(paths.SETTING.CONTACT.DETAIL(row.id))
    }

    const deleteMutation = useMutation({
        mutationFn: (id: string) => contactService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contact] });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Contact deleted successfully");
        },
        onError: (error) => {
            console.error("Failed to delete contact:", error);
        },
    });
    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading contact infos..." />
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

    const contacts = data?.data.contactinfos;

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={contacts}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Contact"
                    title="Contact Information"
                    actions={true}
                    columns={columns}
                    pagination={{
                        totalCount: 10,
                        skip: 0,
                        take: 10,
                    }}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleRowClick}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                name={deleteModal.name?.corporateMail || ""}
                isDeleting={deleteMutation.isPending}
                type="contact"
            />
        </>
    );
}
