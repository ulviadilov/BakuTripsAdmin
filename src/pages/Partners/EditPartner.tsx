import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { partnerService } from "../../services/partners";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { paths } from "../../constants/path";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useEffect } from "react";

interface PartnerFormData {
    companyName: string;
    partnerLogoImage: File;
}

const schema = yup.object({
    companyName: yup
        .string()
        .required("Company Name is required")
        .min(2, "Company name must be at least 2 characters"),
    partnerLogoImage: yup
        .mixed<File>()
        .required("Partner Logo is required")
});

export default function EditPartner() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        data: partnerData,
        isPending: isPartnerLoading,
        error: partnerError,
    } = useQuery({
        queryKey: [QUERY_KEYS.partner, id],
        queryFn: () => partnerService.getPartnerById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PartnerFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            companyName: "",
            partnerLogoImage: undefined,
        },
    });

    useEffect(() => {
        if (partnerData?.data?.partnerLogo) {
            const partner = partnerData.data?.partnerLogo;
            reset({
                companyName: partner.companyName || "",
                partnerLogoImage: undefined, // File uploads typically reset to undefined
            });
        }
    }, [partnerData, reset]);

    const mutation = useMutation({
        mutationFn: (data: PartnerFormData) =>
            partnerService.updatePartner(id!, data),
        onSuccess: () => {
            toast.success("Partner updated successfully");
            navigate(paths.PARTNERS.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to update partner"
            );
        },
    });

    const onSubmit = async (data: PartnerFormData) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.PARTNERS.LIST);
    };

    // Loading state
    if (isPartnerLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="animate-spin h-6 w-6 text-gray-600"
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
                        <span className="text-gray-600">
                            Loading partner...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (partnerError) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Error Loading Partner
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Unable to load partner data. Please try again.
                        </p>
                        <button
                            onClick={handleBack}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
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
                            Edit Partner
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Update partner information
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1">
                        <Input
                            name="companyName"
                            control={control}
                            label="Company Name"
                            type="text"
                            placeholder="Company Name"
                            required={true}
                            error={errors.companyName?.message}
                        />
                    </div>

                    <FileUpload
                        name="partnerLogoImage"
                        control={control}
                        accept="image/*"
                        multiple={false}
                        maxSize={100}
                        maxFiles={1}
                        label="Update Partner Logo Image"
                        description="Drag and drop an image here or click to browse (Max 100MB) - Leave empty to keep current image"
                        showPreview={true}
                        error={errors.partnerLogoImage?.message}
                        required={false}
                        initialUrls={
                            partnerData?.data?.partnerLogo?.logoImagePath
                        }
                    />

                    {/* Submit Buttons */}
                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
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
                                    Updating...
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
                                    Update Partner
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={mutation.isPending}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
