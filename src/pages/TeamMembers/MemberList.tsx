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
import { memberService } from "../../services/member";

const teamOptions = [
    { key: "operation", value: "Operations Team" },
    { key: "sale", value: "Sales & Marketing" },
    { key: "guide", value: "Tour Guides" },
    { key: "drive", value: "Drivers" },
    { key: "support", value: "Support Team" },
];

const columns = [
    {
        key: "posterImagePath",
        label: "Photo",
        type: "image" as const,
        imageSize: "small" as const,
    },
    {
        key: "team",
        label: "Team",
        type: "text" as const,
    },
    {
        key: "position",
        label: "Position",
        type: "text" as const,
    },
    {
        key: "description",
        label: "Description",
        type: "text" as const,
    },
];

export default function MemberList() {
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
        navigate(paths.MEMBER.CREATE);
    };

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.member.all],
        queryFn: () => memberService.getAllMembers(0, 10),
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
        mutationFn: (id: string) => memberService.deleteMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.member.all],
            });
            setDeleteModal({ isOpen: false, name: null });
            toast.success("Member deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete member");
            console.error("Failed to delete member:", error);
        },
    });

    const handleEdit = (row: RowType) => {
        navigate(paths.MEMBER.EDIT(row.id));
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading Members..." />
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

    const { teamMembers, totalCount } = data?.data;

    const updatedMember = teamMembers.map((member:{team:string})=>({
        ...member,
        team: teamOptions.find((team)=>team.key===member.team)?.value || "",
    }))

    const paginationProps = {
        skip: paginationData.skip,
        take: paginationData.take,
        totalCount: totalCount,
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <Table
                    data={updatedMember}
                    creatable={true}
                    searchable={false}
                    createButtonText="Create New Member"
                    title="Team Members"
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
                name={deleteModal.name?.team || deleteModal.name?.position || ""}
                isDeleting={deleteMutation.isPending}
                type="member"
            />
        </>
    );
}
