import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { paths } from "../../constants/path";
import { guideService } from "../../services/guide";
import { useEffect } from "react";

interface GuideFormData {
    language: string;
    price: string;
}

const schema = yup.object({
    language: yup.string().required("Language is required"),
    price: yup.string().required("Price is required"),
});

export default function GuideEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<GuideFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            language: "",
            price: "",
        }
    });

    // Fetch existing guide data
    const { data: guideData, isLoading, error } = useQuery({
        queryKey: ['guide', id],
        queryFn: () => guideService.getGuide(id!),
        enabled: !!id,
    });

    // Update form when data is loaded
    useEffect(() => {
        if (guideData) {
            reset({
                language: guideData?.data?.tourGuide?.language || "",
                price: guideData?.data?.tourGuide?.price?.toString() || "",
            });
        }
    }, [guideData, reset]);

    const mutation = useMutation({
        mutationFn: (data: any) => guideService.updateGuide(id!, data),
        onSuccess: () => {
            toast.success('Guide updated successfully');
            navigate(paths.GUIDE.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update Guide');
        }
    });

    const onSubmit = async (data: GuideFormData) => {
        const formData = {
            ...data,
            price: data.price ? parseFloat(data.price) : 0,
        };
        mutation.mutate(formData);
    };

    const handleBack = () => {
        navigate(paths.GUIDE.LIST);
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-6 w-6 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-slate-600">Loading guide...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading guide</h3>
                        <p className="mt-2 text-gray-600">Unable to load guide data. Please try again.</p>
                        <button
                            onClick={handleBack}
                            className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
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
                        <h1 className="text-2xl font-semibold text-gray-900">Update Guide</h1>
                        <p className="text-gray-600 text-sm mt-1">Edit guide information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            name="language"
                            control={control}
                            label="Language"
                            type="text"
                            placeholder="Enter Language"
                            required={true}
                            error={errors.language?.message}
                        />

                        <Input
                            name="price"
                            control={control}
                            label="Price"
                            type="number"
                            placeholder="Enter price"
                            required={true}
                            error={errors.price?.message}
                        />
                    </div>

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
                                    Update Guide
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
