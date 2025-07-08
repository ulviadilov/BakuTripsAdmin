import { useForm } from "react-hook-form";
import { FileUpload } from "../../components/FIleUpload";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { paths } from "../../constants/path";
import Input from "../../components/Input";
import { sliderService } from "../../services/slider";
import type { SliderUpdateType } from "../../services/slider/type";
import { useEffect } from "react";

const schema = yup.object({
    displayOrder: yup.string().required("Display Order is required"),
    title: yup.string().required("Title is required"),
    subTitle: yup.string().required("Sub Title is required"),
    backgroundImagePath: yup.mixed<File>().required().nullable(),
});

export default function SliderUpdate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: "0",
            title: "",
            subTitle: "",
            backgroundImagePath: null,
        }
    });

    const { data: sliderData, isLoading: isLoadingSlider } = useQuery({
        queryKey: ['slider', id],
        queryFn: () => sliderService.getById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (sliderData) {
            const slider = sliderData?.data?.slider;
            reset({
                displayOrder: slider.displayOrder?.toString() || "0",
                title: slider.title || "",
                subTitle: slider.subTitle || "",
                backgroundImagePath: null,
            });
        }
    }, [sliderData, reset]);

    const mutation = useMutation({
        mutationFn: (data: SliderUpdateType) => sliderService.updateSlider(id!, data),
        onSuccess: () => {
            toast.success('Slider updated successfully');
            navigate(paths.SLIDER.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update Slider');
        }
    });

    const onSubmit = async (data: SliderUpdateType) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.SLIDER.LIST);
    };

    if (isLoadingSlider) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                </div>
            </div>
        );
    }

    if (!sliderData) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Slider not found</h2>
                    <p className="text-gray-600 mb-4">The slider you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBack}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900"
                    >
                        Go Back
                    </button>
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
                        <h1 className="text-2xl font-semibold text-gray-900">Update Slider</h1>
                        <p className="text-gray-600 text-sm mt-1">Edit slider information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1">
                        <Input
                            name="displayOrder"
                            control={control}
                            label="Display Order"
                            type="number"
                            placeholder="Display Order"
                            required={true}
                            error={errors.displayOrder?.message}
                        />
                        <Input
                            name="title"
                            control={control}
                            label="Title"
                            type="text"
                            placeholder="Title"
                            required={true}
                            error={errors.title?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <Input
                            name="subTitle"
                            control={control}
                            label="Sub Title"
                            type="text"
                            placeholder="Sub Title"
                            required={true}
                            error={errors.subTitle?.message}
                        />
                    </div>

                    <FileUpload
                        name="backgroundImagePath"
                        control={control}
                        accept="image/*"
                        multiple={false}
                        maxSize={100}
                        maxFiles={1}
                        label="Background Image"
                        description="Drag and drop an image here or click to browse (Max 100MB). Leave empty to keep current image."
                        showPreview={true}
                        error={errors.backgroundImagePath?.message}
                        required={false}
                        initialUrls={sliderData?.data?.slider?.backgroundImagePath}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Update Slider
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
