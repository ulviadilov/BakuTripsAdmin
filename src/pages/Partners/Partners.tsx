import { useNavigate } from "react-router";
import { Table } from "../../components/Table";
import { paths } from "../../constants/path";

const columns = [
    {
        key: "logo",
        label: "Logo",
        type:"image" as const,
        imageSize:'small' as const
    },
];

const data = [
    {
        id: "",
        logo: "https://bakuheritage.com/uploads/partners/94a06495-6fd5-4792-a00d-d01b6f7d664c277292737_1209962016416237_5136662005344070434_n.jpg",
    },
];

export default function PartnersList() {
    const navigate = useNavigate()
    const handleDelete = (row: any) => {
        console.log(row)
    };
    const handleCreate=()=>{
        navigate(paths.PARTNERS.CREATE)
    }
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Table
                columns={columns}
                data={data}
                creatable={true}
                createButtonText="Create New"
                title="Partners"
                searchable={false}
                actions={true}
                onDelete={handleDelete}
                onCreate={handleCreate}
                pagination={{
                    totalCount: 11,
                    skip: 0,
                    take: 10,
                }}
                onPageChange={(data) => {
                    console.log(data);
                }}
                onSearch={(data) => {
                    console.log(data);
                }}
            />
        </div>
    );
}
