import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { ArrayInput } from "../../components/ArrayInput";
import { groupTourService } from "../../services/groupTour";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { categoryService } from "../../services/category";
import Select from "../../components/Select";
import type {TourFormDataGet } from "../../types";
import { paths } from "../../constants/path";

const schema = yup.object({
    tourCategoryId: yup.string().required("Tour Category ID is required"),
    order: yup
        .string()
        .required("Order is required")
        .min(0, "Order must be at least 0"),
    name: yup
        .string()
        .required("Tour name is required")
        .min(2, "Name must be at least 2 characters"),
    googleMapUrl: yup
        .string()
        .url("Must be a valid URL")
        .required("Google Map URL is required"),
    duration: yup.string().required("Duration is required"),
    isPopular: yup.boolean().required("Popular status is required"),
    shortDescription: yup
        .string()
        .required("Short description is required")
        .min(10, "Short description must be at least 10 characters"),
    fullDescription: yup
        .string()
        .required("Full description is required")
        .min(50, "Full description must be at least 50 characters"),
    priceForAdult: yup
        .number()
        .required("Adult price is required")
        .min(0, "Price must be positive"),
    priceForChild: yup
        .number()
        .required("Child price is required")
        .min(0, "Price must be positive"),
    priceForInfant: yup
        .number()
        .required("Infant price is required")
        .min(0, "Price must be positive"),
    importantInfos: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one important info is required")
        .required(),
    tourPrograms: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one tour program is required")
        .required(),
    includes: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one include is required")
        .required(),
    excludes: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one exclude is required")
        .required(),
    posterImageFile: yup.mixed<File>().required().nullable(),
    vrimagefile: yup.mixed<File>().required().nullable(),
    tourImages: yup.array().of(yup.mixed<{id:string,imagePath:string}>().required()).required(),
});

export default function TourUpdate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch categories
    const { data: categoriesData, isPending: categoriesPending } = useQuery({
        queryKey: [QUERY_KEYS.category],
        queryFn: categoryService.categeroySelect,
    });

    // Fetch tour data
    const {
        data: tourData,
        isPending: tourPending,
        error: tourError,
    } = useQuery({
        queryKey: [QUERY_KEYS.groupTour, id],
        queryFn: () => groupTourService.getById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TourFormDataGet>({
        resolver: yupResolver(schema),
        defaultValues: {
            tourCategoryId: "",
            order: "0",
            name: "",
            googleMapUrl: "",
            duration: "",
            isPopular: false,
            shortDescription: "",
            fullDescription: "",
            priceForAdult: 0,
            priceForChild: 0,
            priceForInfant: 0,
            importantInfos: [],
            tourPrograms: [],
            includes: [],
            excludes: [],
            posterImageFile: null,
            vrimagefile: null,
            tourImages: [],
        },
    });

    const [removeIds,setRemoveIds] = useState<string[]>([]);
    const [newImagesFiles,setNewImageFiles] = useState<File[]>([])

    useEffect(() => {
        if (tourData?.data?.grouptour) {
            const tour = tourData?.data?.grouptour;
            reset({
                tourCategoryId: tour.tourCategoryId || "",
                order: tour.order?.toString() || "0",
                name: tour.name || "",
                googleMapUrl: tour.googleMapUrl || "",
                duration: tour.duration || "",
                isPopular: tour.isPopular || false,
                shortDescription: tour.shortDescription || "",
                fullDescription: tour.fullDescription || "",
                priceForAdult: tour.priceForAdult || 0,
                priceForChild: tour.priceForChild || 0,
                priceForInfant: tour.priceForInfant || 0,
                importantInfos: tour.importantInfos || [],
                tourPrograms: tour.tourPrograms || [],
                includes: tour.includes || [],
                excludes: tour.excludes || [],
                posterImageFile: null,
                vrimagefile: null,
                tourImages: [],
            });
        }
    }, [tourData, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: TourFormDataGet) =>
            groupTourService.updateTour(id!, data,newImagesFiles,removeIds),
        onSuccess: () => {
            toast.success("Tour updated successfully");
            navigate(paths.GROUP_TOUR.LIST);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update tour");
        },
    });

    const onSubmit = async (data: TourFormDataGet) => {
        const srcMatch = data.googleMapUrl.match(/src="([^"]+)"/);
        const extractedSrc = srcMatch ? srcMatch[1] : '';
        data.googleMapUrl = extractedSrc ? extractedSrc : data.googleMapUrl;
        updateMutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.GROUP_TOUR.LIST);
    };

    const handleDelete = (id:string)=>{
        const isExist = tourData?.data?.grouptour?.tourImages.find((image:{id:string})=>image.id===id)
        if(isExist){
            const prevExist = removeIds?.find((X)=>X === id)
            setRemoveIds((prev)=>{
                if(prevExist){
                    return prev
                }else{
                    return [...prev,id]
                }
            })
        }
    }

    const handleFileChange = (file:any)=>{
        setNewImageFiles([...file])
    }


    // Loading state
    if (tourPending) {
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
    if (tourError) {
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

            <div className="w-full max-w-6xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                name="tourCategoryId"
                                control={control}
                                label="Tour Category ID"
                                placeholder="Enter tour category ID"
                                required={true}
                                isPending={categoriesPending}
                                options={categoriesData?.data || []}
                                error={errors.tourCategoryId?.message}
                            />

                            <Input
                                name="order"
                                control={control}
                                label="Display Order"
                                type="number"
                                placeholder="Enter display order"
                                required={true}
                                error={errors.order?.message}
                            />

                            <Input
                                name="name"
                                control={control}
                                label="Tour Name"
                                type="text"
                                placeholder="Enter tour name"
                                required={true}
                                error={errors.name?.message}
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

                            <div className="md:col-span-2">
                                <Input
                                    name="googleMapUrl"
                                    control={control}
                                    label="Google Map URL"
                                    type="url"
                                    placeholder="Enter Google Map URL"
                                    required={true}
                                    error={errors.googleMapUrl?.message}
                                />
                            </div>

                            {/* Is Popular Checkbox */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Popular Tour
                                </label>
                                <Controller
                                    name="isPopular"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.checked
                                                    )
                                                }
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-600">
                                                Mark this tour as popular
                                            </label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <iframe
                        className="col-1"
                        src={tourData.data?.grouptour?.googleMapUrl}
                        width="100%"
                        height="450"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Pricing Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                name="priceForAdult"
                                control={control}
                                label="Adult Price"
                                type="number"
                                placeholder="0.00"
                                required={true}
                                error={errors.priceForAdult?.message}
                            />

                            <Input
                                name="priceForChild"
                                control={control}
                                label="Child Price"
                                type="number"
                                placeholder="0.00"
                                required={true}
                                error={errors.priceForChild?.message}
                            />

                            <Input
                                name="priceForInfant"
                                control={control}
                                label="Infant Price"
                                type="number"
                                placeholder="0.00"
                                required={true}
                                error={errors.priceForInfant?.message}
                            />
                        </div>
                    </div>

                    {/* Descriptions Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Descriptions
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Short Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="shortDescription"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            rows={3}
                                            placeholder="Enter short description"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        />
                                    )}
                                />
                                {errors.shortDescription && (
                                    <p className="text-red-500 text-sm">
                                        {errors.shortDescription.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="fullDescription"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            rows={6}
                                            placeholder="Enter full description"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        />
                                    )}
                                />
                                {errors.fullDescription && (
                                    <p className="text-red-500 text-sm">
                                        {errors.fullDescription.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tour Details Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Tour Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ArrayInput
                                name="includes"
                                control={control}
                                label="Includes"
                                placeholder="Add what's included..."
                                required={true}
                                error={errors.includes?.message}
                                icon={
                                    <svg
                                        className="w-4 h-4 inline text-green-600"
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
                                }
                            />

                            <ArrayInput
                                name="excludes"
                                control={control}
                                label="Excludes"
                                placeholder="Add what's excluded..."
                                required={true}
                                error={errors.excludes?.message}
                                icon={
                                    <svg
                                        className="w-4 h-4 inline text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                }
                            />

                            <ArrayInput
                                name="importantInfos"
                                control={control}
                                label="Important Information"
                                placeholder="Add important info..."
                                required={true}
                                error={errors.importantInfos?.message}
                                icon={
                                    <svg
                                        className="w-4 h-4 inline text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                }
                            />

                            <ArrayInput
                                name="tourPrograms"
                                control={control}
                                label="Tour Programs"
                                placeholder="Add tour program..."
                                required={true}
                                error={errors.tourPrograms?.message}
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
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Images
                        </h2>
                        <div className="space-y-6">
                            {/* Current Images Info */}
                            {tourData?.data && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                                        Current Images
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Upload new images only if you want to
                                        replace the existing ones. Leaving the
                                        fields empty will keep the current
                                        images.
                                    </p>
                                </div>
                            )}

                            {/* Poster Image - Optional for update */}
                            <FileUpload
                                name="posterImageFile"
                                control={control}
                                accept="image/*"
                                multiple={false}
                                maxSize={100}
                                maxFiles={1}
                                label="Poster Image"
                                description="Replace poster image (Optional, Max 100MB)"
                                showPreview={true}
                                error={errors.posterImageFile?.message}
                                required={false}
                                initialUrls={
                                    tourData?.data?.grouptour.posterImagePath
                                }
                            />

                            {/* VR Image - Optional for update */}
                            <FileUpload
                                name="vrimagefile"
                                control={control}
                                accept="image/*"
                                multiple={false}
                                maxSize={100}
                                maxFiles={1}
                                label="VR Image"
                                description="Replace VR image (Optional, Max 100MB)"
                                showPreview={true}
                                error={errors.vrimagefile?.message}
                                required={false}
                                initialUrls={
                                    tourData?.data?.grouptour.vrImagePath
                                }
                            />

                            {/* Tour Images - Optional for update */}
                            <FileUpload
                                name="tourImages"
                                control={control}
                                accept="image/*"
                                multiple={true}
                                maxSize={100}
                                maxFiles={10}
                                label="Tour Images"
                                description="Replace tour images (Optional, Max 10 files, 100MB each)"
                                showPreview={true}
                                error={errors.tourImages?.message}
                                onDelete={handleDelete}
                                onFilesChange={handleFileChange}
                                required={false}
                                initialUrls={
                                    tourData?.data?.grouptour?.tourImages
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
