import { Table } from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import Spinner from "../../components/Spinner";
import { ErrorMessage } from "../../components/Error";
import { useEffect, useState, useCallback } from "react";
import { userService } from "../../services/user";
import type { User } from "../../services/user/types";

const columns = [
    {
        key: "name",
        label: "Name",
        type: "text" as const,
    },
    {
        key: "surname",
        label: "Surname",
        type: "text" as const,
    },
    {
        key: "email",
        label: "E-mail",
        type: "text" as const,
    },
    {
        key: "isEmailConfirmed",
        label: "Confirmed Email",
        type: "text" as const,
    },
    {
        key: "role",
        label: "Role",
        type: "text" as const,
    },
];


export default function UserList() {
    const [totalCount, setTotalCount] = useState(0);
    const [paginationData, setPaginationData] = useState({
        skip: 0,
        take: 10,
    });

    const queryFn = useCallback(() => {
        return userService.getAll(paginationData.skip, paginationData.take);
    }, [paginationData.skip, paginationData.take]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.user, paginationData.skip, paginationData.take],
        queryFn,
        staleTime: 5 * 60 * 1000,
    });


    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const handlePageChange = useCallback((skip: number, take: number) => {
        setPaginationData({
            skip: skip || 0,
            take: take || 3,
        });
    }, []);

    const handleSearch = useCallback((searchData: any) => {
        console.log("Search data:", searchData);
    }, []);

    useEffect(() => {
        if (data?.data?.totaluserscount !== undefined) {
            setTotalCount(data.data.totaluserscount);
        }
    }, [data?.data?.totaluserscount]);

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading users..." />
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

    // Process user data
    const users = data?.data?.users || [];
    const updatedItems = users.map((user: User) => ({
        ...user,
        role: user.roles?.length > 0 ? user.roles[0] : "No Role",
        isEmailConfirmed: user.isEmailConfirmed ? (
            <span className="bg-green-500 py-1 px-2.5 rounded-3xl text-white">
                Confirmed
            </span>
        ) : (
            <span className="bg-red-500 py-1 px-2.5 rounded-3xl text-white">
                Unconfirmed
            </span>
        ),
    }));

    // Create pagination object
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
                    data={updatedItems}
                    title="Users"
                    searchable={false}
                    actions={false}
                    pagination={paginationProps}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                />
            </div>
        </>
    );
}
