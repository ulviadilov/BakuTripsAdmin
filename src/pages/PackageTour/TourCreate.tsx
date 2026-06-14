import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useFormDraft, clearDraft } from "../../utils/draft";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { packageTourService } from "../../services/packageTour";
import { paths } from "../../constants/path";
import { otherLanguages } from "../../constants";

interface TourFormData {
    displayOrder: string;
    title: string;
    duration: string;
    basePrice: string;
    posterImageFile: File | string;
    // Capital Translations for backend
    Translations: { languageCode: string; title: string; duration: string }[];
}

const schema = yup.object({
    displayOrder: yup
        .string()
        .required("Display order is required")
        .min(0, "Display order must be at least 0"),
    title: yup.string().required("Title is required"),
    duration: yup.string().required("Duration is required"),
    basePrice: yup
        .string()
        .required("Base Price is required")
        .min(0, "Base Price must be at least 0"),
    posterImageFile: yup
        .mixed<File | string>()
        .required("Poster image is required"),
    // Optional translations block
    Translations: yup
        .array()
        .of(
            yup.object({
                languageCode: yup.string().required(),
                title: yup.string().defined(),
                duration: yup.string().defined(),
            })
        )
        .required(),
});

export default function TourCreate() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<TourFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: "0",
            basePrice: "0",
            title: "",
            duration: "",
            posterImageFile: "",
            Translations: otherLanguages.map((l) => ({
                languageCode: l.code,
                title: "",
                duration: "",
            })),
        },
    });

    // Persist draft for Package Tour create (omit file fields)
    useFormDraft<TourFormData>("create:package-tour", { reset, watch }, { omit: ["posterImageFile"] });

    const { fields: translationFields } = useFieldArray({ control, name: "Translations" });
    const [activeLang, setActiveLang] = useState<string>(otherLanguages[0]?.code || "az");

    const mutation = useMutation({
        mutationFn: packageTourService.createTourPackage,
        onSuccess: () => {
            toast.success("Tour created successfully");
            clearDraft("create:package-tour");
            navigate(paths.PACKAGE_TOUR_PACKAGE.LIST);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create tour");
        },
    });

    const onSubmit = async (data: TourFormData) => {
        const formData = new FormData();
        formData.append("displayOrder", data.displayOrder.toString());
        formData.append("title", data.title);
        formData.append("basePrice", data.basePrice);
        formData.append("duration", data.duration);

        if (data.posterImageFile) {
            formData.append("posterImageFile", data.posterImageFile);
        }

        // Append Translations (capital T)
        data.Translations?.forEach((tr, i) => {
            formData.append(`Translations[${i}].languageCode`, tr.languageCode);
            formData.append(`Translations[${i}].title`, tr.title);
            formData.append(`Translations[${i}].duration`, tr.duration);
        });

        mutation.mutate(formData);
    };

    const handleBack = () => {
        navigate(paths.PACKAGE_TOUR_PACKAGE.LIST);
    };

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
                            Create Tour
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Add a new tour package
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
                                name="title"
                                control={control}
                                label="Tour Title"
                                type="text"
                                placeholder="Enter tour title"
                                required={true}
                                error={errors.title?.message}
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
                                name="basePrice"
                                control={control}
                                label="Base Price ($)"
                                type="number"
                                placeholder="Enter Base Price"
                                required={true}
                                error={errors.basePrice?.message}
                            />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Images
                        </h2>
                        <div className="space-y-6">
                            {/* Poster Image - Required Single File */}
                            <FileUpload
                                name="posterImageFile"
                                control={control}
                                accept="image/*"
                                multiple={false}
                                maxSize={100}
                                maxFiles={1}
                                label="Poster Image"
                                description="Main poster image for the tour (Required, Max 100MB)"
                                showPreview={true}
                                error={errors.posterImageFile?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* Translations Section */}
                    {otherLanguages.length > 0 && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Translations</h3>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {otherLanguages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`${activeLang === lang.code ? "border-slate-500 text-slate-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {translationFields.map((field, idx) => (
                                    <div
                                        key={field.id}
                                        style={{ display: activeLang === otherLanguages[idx]?.code ? "block" : "none" }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                name={`Translations.${idx}.title`}
                                                control={control}
                                                label={`Title (${otherLanguages[idx]?.code.toUpperCase()})`}
                                                type="text"
                                                placeholder="Enter title"
                                            />
                                            <Input
                                                name={`Translations.${idx}.duration`}
                                                control={control}
                                                label={`Duration (${otherLanguages[idx]?.code.toUpperCase()})`}
                                                type="text"
                                                placeholder="e.g., 3 days, 1 week"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                                    Creating Package...
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
                                    Create Package
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
