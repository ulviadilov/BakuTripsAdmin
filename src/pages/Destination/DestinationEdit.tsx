import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { destinationService } from "../../services/destination";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import Select from "../../components/Select";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { tourService } from "../../services/tours";
import { useEffect } from "react";

interface DestinationFormData {
    tourId: string;
    displayOrder: string;
    name: string;
    duration: string;
    description: string;
    imageFile?: File | undefined;
}

const schema = yup.object({
    tourId: yup.string().required("Tour Id is required"),
    displayOrder: yup.string().required("Display order is required"),
    name: yup.string().required("Destination name is required").min(2, "Name must be at least 2 characters"),
    duration: yup.string().required("Duration is required"),
    description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
});

export default function DestinationEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: toursData, isPending: isToursLoading } = useQuery({
        queryKey: [QUERY_KEYS.tour.select],
        queryFn: tourService.tourSelect
    });

    const { data: destinationData, isPending: isDestinationLoading, error: destinationError } = useQuery({
        queryKey: [QUERY_KEYS.destination.detail, id],
        queryFn: () => destinationService.getById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<DestinationFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            tourId: '',
            displayOrder: '',
            name: '',
            duration: '',
            description: '',
            imageFile: undefined
        }
    });

    useEffect(() => {
        if (destinationData?.destination) {
            const destination = destinationData.destination;
            reset({
                tourId: destination.tourId || '',
                displayOrder: destination.displayOrder?.toString() || '',
                name: destination.name || '',
                duration: destination.duration || '',
                description: destination.description || '',
                imageFile: undefined // File uploads typically reset to undefined
            });
        }
    }, [destinationData, reset]);

    const mutation = useMutation({
        mutationFn: (data: DestinationFormData) => destinationService.update(id!, data),
        onSuccess: () => {
            toast.success('Destination updated successfully');
            navigate('/destination');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update destination');
        }
    });

    const onSubmit = async (data: DestinationFormData) => {
        const formData = {
            ...data,
            displayOrder: data.displayOrder
        };
        mutation.mutate(formData);
    };

    const handleBack = () => {
        navigate('/destination');
    };

    // Loading state
    if (isDestinationLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Loading destination...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (destinationError) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Destination</h3>
                        <p className="text-gray-600 mb-4">Unable to load destination data. Please try again.</p>
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
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Destination</h1>
                        <p className="text-gray-600 text-sm mt-1">Update destination information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            name="tourId"
                            control={control}
                            label="Tour Id"
                            placeholder="Select tour Id"
                            required={true}
                            isPending={isToursLoading}
                            options={toursData?.data || []}
                            error={errors.tourId?.message}
                        />

                        {/* Display Order */}
                        <Input
                            name="displayOrder"
                            control={control}
                            label="Display Order"
                            type="number"
                            placeholder="Enter display order"
                            required={true}
                            error={errors.displayOrder?.message}
                        />

                        {/* Destination Name */}
                        <Input
                            name="name"
                            control={control}
                            label="Destination Name"
                            type="text"
                            placeholder="Enter destination name"
                            required={true}
                            error={errors.name?.message}
                        />

                        {/* Duration */}
                        <Input
                            name="duration"
                            control={control}
                            label="Duration"
                            type="text"
                            placeholder="e.g., 2 hours, Half day, Full day"
                            required={true}
                            error={errors.duration?.message}
                        />
                    </div>

                    {/* Description - Full Width */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Enter destination description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image File Upload - Full Width */}
                    <FileUpload
                        name="imageFile"
                        control={control}
                        accept="image/*"
                        multiple={false}
                        maxSize={5}
                        maxFiles={1}
                        label="Update Destination Image"
                        description="Drag and drop an image here or click to browse (Max 5MB) - Leave empty to keep current image"
                        showPreview={true}
                        error={errors.imageFile?.message}
                        required={false}
                        initialUrls={destinationData?.destination?.imageFile}


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
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Update Destination
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
