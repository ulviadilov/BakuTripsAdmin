import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "../../components/Table";
import { DeleteConfirmationModal } from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { paths } from "../../constants/path";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { blogsService } from "../../services/blogs";

const columns = [
  { key: "authorName", label: "Author", type: "text" as const },
  { key: "mainTitle", label: "Main Title", type: "text" as const },
  { key: "firstImagePath", label: "First Image", type: "image" as const, imageSize: "small" as const },
];

export default function BlogList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paginationData, setPaginationData] = useState({ skip: 0, take: 10 });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; name: any }>({ isOpen: false, name: null });

  const handlePageChange = useCallback((skip: number, take: number) => {
    setPaginationData({ skip: skip || 0, take: take || 10 });
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.blog.all, paginationData.skip, paginationData.take],
    queryFn: () => blogsService.getAll(paginationData.skip, paginationData.take),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog.all] });
      setDeleteModal({ isOpen: false, name: null });
      toast.success("Blog deleted successfully");
    },
    onError: () => toast.error("Failed to delete blog"),
  });

  const handleRetry = () => refetch();
  const handleCreate = () => navigate(paths.BLOG.CREATE);
  const handleEdit = (row: any) => navigate(paths.BLOG.EDIT(row.id));
  const handleView = (row: any) => navigate(paths.BLOG.DETAIL(row.id));

  const handleDelete = (row: any) => setDeleteModal({ isOpen: true, name: row });
  const handleCloseModal = () => { if (!deleteMutation.isPending) setDeleteModal({ isOpen: false, name: null }); };
  const handleConfirmDelete = () => { if (deleteModal.name) deleteMutation.mutate(deleteModal.name.id); };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Spinner message="Loading blogs..." />
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

  const { blogs = [], totalCount = 0 } = data?.data || {};
  const paginationProps = { skip: paginationData.skip, take: paginationData.take, totalCount };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <Table
          columns={columns}
          data={blogs}
          creatable={true}
          createButtonText="Create New Blog"
          title="Blogs"
          searchable={false}
          actions={true}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
          pagination={paginationProps}
          onPageChange={handlePageChange}
          onSearch={(s) => console.log(s)}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        name={deleteModal.name?.mainTitle || ""}
        isDeleting={deleteMutation.isPending}
        type="blog"
      />
    </>
  );
}
