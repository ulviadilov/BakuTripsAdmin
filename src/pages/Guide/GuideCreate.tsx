import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { paths } from "../../constants/path";
import { guideService } from "../../services/guide";
import { useState } from "react";
import { useFormDraft, clearDraft } from "../../utils/draft";
import { otherLanguages } from "../../constants";

interface GuideFormData {
    language: string;
    price: string;
    translations: Array<{
        languageCode: string;
        language: string;
    }>;
}

const schema = yup.object({
    language: yup.string().required("Language is required"),
    price: yup.string().required("Price is required"),
    translations: yup
        .array()
        .of(
            yup
                .object({
                    languageCode: yup.string().required(),
                    language: yup.string().required("Language is required"),
                })
                .required()
        )
        .required(),
});

export default function GuideCreate() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<GuideFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            language: "",
            price: "",
            translations: otherLanguages.map((lang) => ({
                languageCode: lang.code,
                language: "",
            })),
        }
    });

    // Persist guide draft
    useFormDraft<GuideFormData>("create:guide", { reset, watch });

    const { fields } = useFieldArray({ control, name: "translations" });
    const [activeLang, setActiveLang] = useState(otherLanguages[0]?.code ?? "");

    const mutation = useMutation({
        mutationFn: guideService.createGuide,
        onSuccess: () => {
            toast.success('Guide created successfully');
            reset();
            clearDraft("create:guide");
            navigate(paths.GUIDE.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create Guide');
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
                        <h1 className="text-2xl font-semibold text-gray-900">Create Guide</h1>
                        <p className="text-gray-600 text-sm mt-1">Add a new guide</p>
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
                            label="Language (English)"
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

                    {otherLanguages.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Translations</h3>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {otherLanguages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`${activeLang === lang.code
                                                ? "border-slate-500 text-slate-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        style={{ display: activeLang === field.languageCode ? "block" : "none" }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                name={`translations.${index}.language`}
                                                control={control}
                                                label="Language"
                                                type="text"
                                                placeholder="Enter Language"
                                                required={true}
                                                error={errors.translations?.[index]?.language?.message}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Guide
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
