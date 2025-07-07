import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { useEffect } from "react";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { packageOptionService } from "../../../services/packageTour/option";
import { dailyProgramService } from "../../../services/packageTour/dailyProgram";
import type { DailyProgram } from "../../../types";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import { ArrayInput } from "../../../components/ArrayInput";
import { paths } from "../../../constants/path";

const schema = yup.object({
    packageOptionId: yup.string().required("Package Option ID is required"),
    displayOrder: yup
        .string()
        .required("Display Order is required")
        .min(0, "Order must be at least 0"),
    title: yup
        .string()
        .required("Title is required")
        .min(2, "Title must be at least 2 characters"),
    destinations: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one destination is required")
        .required(),
});

export default function DailyProgramUpdate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch package options
    const { data: packageOptionsData, isPending: packageOptionsPending } = useQuery({
        queryKey: [QUERY_KEYS.packageOption.select],
        queryFn: packageOptionService.optionSelect,
    });

    // Fetch daily program data
    const {
        data: programData,
        isPending: programPending,
        error: programError,
    } = useQuery({
        queryKey: [QUERY_KEYS.packageDailyProgram, id],
        queryFn: () => dailyProgramService.getDailyProgramById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DailyProgram>({
        resolver: yupResolver(schema),
        defaultValues: {
            packageOptionId: "",
            displayOrder: "0",
            title: "",
            destinations: [],
        },
    });

    useEffect(() => {
        if (programData?.data) {
            const program = programData?.data;
            reset({
                packageOptionId: program.packageoptionid || "",
                displayOrder: program.displayorder?.toString() || "0",
                title: program.title || "",
                destinations: program.destinations || [],
            });
        }
    }, [programData, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: DailyProgram) =>
            dailyProgramService.updateDailyProgram(id!, data),
        onSuccess: () => {
            toast.success("Daily program updated successfully");
            navigate(paths.PACKAGE_DAILY_PROGRAM.LIST);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update daily program");
        },
    });

    const onSubmit = async (data: DailyProgram) => {
        updateMutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.PACKAGE_DAILY_PROGRAM.LIST);
    };

    // Loading state
    if (programPending) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center min-h-96">
                    <div className="flex items-center space-x-4">
                        <svg
                            className="animate-spin h-8 w-8 text-slate-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-lg text-gray-600">
                            Loading daily program data...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (programError) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="text-red-500 text-lg font-medium mb-2">
                            Error loading daily program data
                        </div>
                        <p className="text-gray-600 mb-4">
                            Unable to fetch daily program information. Please try again.
                        </p>
                        <button
                            onClick={handleBack}
                            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Go back"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Update Daily Program
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Edit daily program details
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                name="packageOptionId"
                                control={control}
                                label="Package Option"
                                placeholder="Select package option"
                                required={true}
                                isPending={packageOptionsPending}
                                options={packageOptionsData?.data || []}
                                error={errors.packageOptionId?.message}
                            />

                            <Input
                                name="displayOrder"
                                control={control}
                                label="Display Order"
                                type="number"
                                placeholder="Enter display order"
                                required={true}
                                error={errors.displayOrder?.message}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    name="title"
                                    control={control}
                                    label="Title"
                                    type="text"
                                    placeholder="Enter daily program title"
                                    required={true}
                                    error={errors.title?.message}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destinations Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Destinations
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <ArrayInput
                                name="destinations"
                                control={control}
                                label="Destinations"
                                placeholder="Add destination..."
                                required={true}
                                error={errors.destinations?.message}
                                icon={
                                    <svg
                                        className="w-4 h-4 inline text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="bg-slate-800 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Updating Daily Program...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Update Daily Program
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={updateMutation.isPending}
                            className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
