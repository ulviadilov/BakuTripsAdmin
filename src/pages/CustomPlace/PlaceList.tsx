import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { DeleteConfirmationModal } from "../../components/Modal";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { customPlaceService } from "../../services/customPackage/place";
import type { RowType } from "../../types";

const columns = [
  { key: "placeImagePath", label: "Image", type: "image" as const, imageSize: "small" as const },
  { key: "name", label: "Name", type: "text" as const },
];

export default function PlaceList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paginationData, setPaginationData] = useState({ skip: 0, take: 10 });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; name: any }>({ isOpen: false, name: null });

  const handlePageChange = useCallback((skip: number, take: number) => {
    setPaginationData({ skip: skip || 0, take: take || 10 });
  }, []);

  const handleCreate = () => navigate(paths.CUSTOM_PLACE.CREATE);
  const handleEdit = (row: RowType) => navigate(paths.CUSTOM_PLACE.EDIT(row.id));
  const handleDelete = (row: any) => setDeleteModal({ isOpen: true, name: row });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["custom-places", paginationData],
    queryFn: () => customPlaceService.getAllPlaces(paginationData.skip, paginationData.take),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customPlaceService.deletePlace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-places"] });
      setDeleteModal({ isOpen: false, name: null });
      toast.success("Place deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete place:", error);
      toast.error("Failed to delete place");
    },
  });

  const handleConfirmDelete = () => {
    if (deleteModal.name) deleteMutation.mutate(deleteModal.name.id);
  };
  const handleCloseModal = () => {
    if (!deleteMutation.isPending) setDeleteModal({ isOpen: false, name: null });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen"><Spinner message="Loading Places..." /></div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen"><ErrorMessage onRetry={() => refetch()} /></div>
    );
  }

  const list = (data?.data.places ?? []).map((p: any) => ({ ...p, createDate: p.createDate ? new Date(p.createDate).toLocaleString() : "" }));
  const totalCount = data?.data.totalCount ?? list.length;
  const paginationProps = { skip: paginationData.skip, take: paginationData.take, totalCount };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <Table
          data={list}
          creatable={true}
          searchable={false}
          createButtonText="Create Place"
          title="Custom Places"
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
        name={deleteModal.name?.name || ""}
        isDeleting={deleteMutation.isPending}
        type="place"
      />
    </>
  );
}
