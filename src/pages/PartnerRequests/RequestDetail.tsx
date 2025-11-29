import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { partnerRequestsService } from "../../services/partnerRequests";

export default function RequestDetail() {
  const { id } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partner-requests", "detail", id],
    queryFn: () => partnerRequestsService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Spinner message="Loading request..." />
      </div>
    );
  }

  if (isError || !data?.data?.partner) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <ErrorMessage onRetry={() => refetch()} />
      </div>
    );
  }

  const p = data.data.partner;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Partner Request Detail</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company Name" value={p.companyName} />
          <Field label="First Name" value={p.firstName} />
          <Field label="Last Name" value={p.lastName} />
          <Field label="Country" value={p.country} />
          <Field label="Phone" value={p.phoneNumber} />
          <Field label="Email" value={p.email} />
          <Field label="Created" value={new Date(p.createDate).toLocaleString()} />
        </div>
        <div>
          <h3 className="font-medium mb-2">Partnership Message</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{p.partnershipMessage}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
