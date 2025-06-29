import { Table } from "../components/Table";

export default function Dashboard(){
      const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'joinDate', label: 'Join Date' },
  ];

  const sampleData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Editor',
      status: 'Active',
      joinDate: '2024-01-25'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-15'
    },
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Editor',
      status: 'Active',
      joinDate: '2024-01-25'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-02-15'
    },

  ];

  const handleView = (row:any) => {
    console.log('View:', row);
  };

  const handleEdit = (row:any) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row:any) => {
    console.log('Delete:', row);
  };

  const handleRowClick = (row:any) => {
    console.log('Row clicked:', row);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Table
        columns={columns}
        data={sampleData}
        title="Team Members"
        searchable={true}
        actions={true}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        pagination={{
            totalCount:200,
            skip:0,
            take:10
        }}
        onPageChange={(data)=>{
            console.log(data)
        }}
        onSearch={(data)=>{
            console.log(data)
        }}

      />
    </div>
  );
}
