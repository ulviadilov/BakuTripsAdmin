import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { partnerRequestsService } from "../../services/partnerRequests";

const columns = [
  { key: "companyName", label: "Company", type: "text" as const },
  { key: "firstName", label: "First Name", type: "text" as const },
  { key: "lastName", label: "Last Name", type: "text" as const },
  { key: "country", label: "Country", type: "text" as const },
  { key: "phoneNumber", label: "Phone", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "createDate", label: "Created", type: "text" as const },
];

export default function RequestsList() {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partner-requests"],
    queryFn: () => partnerRequestsService.getAll(),
  });

  const handleRetry = () => refetch();

  const handleRowClick = (row: any) => {
    navigate(paths.PARTNER_REQUEST.DETAIL(row.id));
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Spinner message="Loading partner requests..." />
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

  const list = (data?.data.partners ?? []).map((p: any) => ({
    ...p,
    createDate: new Date(p.createDate).toLocaleString(),
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Table
        data={list}
        creatable={false}
        searchable={false}
        title="Partner Requests"
        actions={true}
        columns={columns}
        pagination={{ totalCount: list.length, skip: 0, take: list.length || 10 }}
        onView={handleRowClick}
      />
    </div>
  );
}
