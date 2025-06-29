import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { useEffect } from "react";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { packageTourService } from "../../services/packageTour";
import { paths } from "../../constants/path";

interface TourFormData {
    displayOrder: string;
    title: string;
    duration: string;
    basePrice: string;
    posterImagePath: File | null;
}

const schema = yup.object({
    displayOrder: yup
        .string()
        .required("Display order is required")
        .test("min-value", "Display order must be at least 0", (value) =>
            value ? parseInt(value) >= 0 : false
        ),
    title: yup.string().required("Title is required"),
    duration: yup.string().required("Duration is required"),
    basePrice: yup
        .string()
        .required("Base Price is required")
        .test("min-value", "Base Price must be at least 0", (value) =>
            value ? parseFloat(value) >= 0 : false
        ),
    posterImagePath: yup
        .mixed<File>().required()
        .nullable(),
});

export default function TourUpdate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch tour data
    const {
        data: packageData,
        isPending: packagePending,
        error: packageError
    } = useQuery({
        queryKey: [QUERY_KEYS.package, id],
        queryFn: () => packageTourService.getPackageById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TourFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: "0",
            basePrice: "0",
            title: "",
            duration: "",
            posterImagePath: null,
        },
    });

    useEffect(() => {
        if (packageData?.data) {
            const tourPackage = packageData?.data?.travelpackage;
            reset({
                displayOrder: tourPackage?.displayOrder?.toString() || "0",
                basePrice: tourPackage?.basePrice?.toString() || "0",
                title: tourPackage?.title || "",
                duration: tourPackage?.duration || "",
                posterImagePath: null
            });
        }
    }, [packageData, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: TourFormData) =>
            packageTourService.updatePackage(id!, data),
        onSuccess: () => {
            toast.success("Tour updated successfully");
            navigate(paths.PACKAGE_TOUR_PACKAGE.LIST);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update tour");
        },
    });

    const onSubmit = async (data: TourFormData) => {
        updateMutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.PACKAGE_TOUR_PACKAGE.LIST);
    };

    // Loading state
    if (packagePending) {
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
                            Loading tour data...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (packageError) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="text-red-500 text-lg font-medium mb-2">
                            Error loading tour data
                        </div>
                        <p className="text-gray-600 mb-4">
                            Unable to fetch tour information. Please try again.
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
                            Update Tour
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Edit tour package details
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
                                name="duration"
                                control={control}
                                label="Duration"
                                type="text"
                                placeholder="e.g., 3 days, 1 week"
                                required={true}
                                error={errors.duration?.message}
                            />

                            <Input
                                name="title"
                                control={control}
                                label="Tour Title"
                                type="text"
                                placeholder="Enter tour title"
                                required={true}
                                error={errors.title?.message}
                            />


                            <Input
                                name="basePrice"
                                control={control}
                                label="Base Price"
                                type="number"
                                placeholder="0.00"
                                required={true}
                                error={errors.basePrice?.message}
                            />
                        </div>
                    </div>

                    {/* Google Map Section - Display only if URL exists */}

                    {/* Images Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Poster Image
                        </h2>
                        <div className="space-y-6">
                            {/* Current Image Info */}
                            {packageData?.data && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                                        Current Image
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Upload a new image only if you want to replace the existing one.
                                        Leaving this field empty will keep the current image.
                                    </p>
                                </div>
                            )}

                            {/* Poster Image - Optional for update */}
                            <FileUpload
                                name="posterImagePath"
                                control={control}
                                accept="image/*"
                                multiple={false}
                                maxSize={5}
                                maxFiles={1}
                                label="Poster Image"
                                description="Replace poster image (Optional, Max 5MB)"
                                showPreview={true}
                                error={errors.posterImagePath?.message}
                                required={false}
                                initialUrls={
                                    packageData?.data?.travelpackage?.posterImagePath
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
                                    Updating Tour...
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
                                    Update Tour
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
