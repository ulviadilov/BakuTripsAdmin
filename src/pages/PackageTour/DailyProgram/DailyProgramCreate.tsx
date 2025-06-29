import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { packageOptionService } from "../../../services/packageTour/option";
import { dailyProgramService } from "../../../services/packageTour/dailyProgram";
import { paths } from "../../../constants/path";
import Select from "../../../components/Select";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import Input from "../../../components/Input";
import { ArrayInput } from "../../../components/ArrayInput";
import type { DailyProgram } from "../../../types";


const schema = yup.object({
    packageOptionId: yup.string().required("Package option is required"),
    displayOrder: yup
        .string()
        .required("Display order is required")
        .min(1, "Display order must be at least 1"),
    title: yup.string().required("Title is required"),
    destinations: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one destination is required")
        .required("Destinations are required"),
});

export default function DailyProgramCreate() {
    const navigate = useNavigate();

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

    // Fetch package options
    const { data: packageOptions, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.packageOption.select],
        queryFn: packageOptionService.optionSelect,
    });

    const mutation = useMutation({
        mutationFn: dailyProgramService.createDailyProgram,
        onSuccess: () => {
            toast.success("Daily program created successfully");
            reset();
            navigate(paths.PACKAGE_DAILY_PROGRAM.LIST);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create daily program");
        },
    });

    const onSubmit = async (data: DailyProgram) => {
        const submitData = {
            packageOptionId: data.packageOptionId,
            displayOrder: data.displayOrder,
            title: data.title,
            destinations: data.destinations,
        };

        mutation.mutate(submitData);
    };

    const handleBack = () => {
        navigate(paths.PACKAGE_TOUR_OPTION.LIST);
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading package options...</p>
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
                            Create Daily Program
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Add a new daily program
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Package Option Select */}
                            <Select
                                name="packageOptionId"
                                control={control}
                                label="Package Option"
                                placeholder="Select a package option"
                                required={true}
                                error={errors.packageOptionId?.message}
                                options={packageOptions?.data}
                                isPending={isLoading}
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

                            <Input
                                name="title"
                                control={control}
                                label="Program Title"
                                type="text"
                                placeholder="Enter program title"
                                required={true}
                                error={errors.title?.message}
                            />
                        </div>
                    </div>

                    {/* Destinations Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Destinations
                        </h2>
                        <div className="space-y-6">
                            <ArrayInput
                                name="destinations"
                                control={control}
                                label="Destinations"
                                placeholder="Enter destination name"
                                required={true}
                                error={errors.destinations?.message}
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-slate-800 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {mutation.isPending ? (
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
                                    Creating Program...
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Create Program
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={mutation.isPending}
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
