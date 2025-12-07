import { useState } from "react";
import { useFormDraft, clearDraft } from "../../utils/draft";
import { useForm, useFieldArray } from "react-hook-form";
import { FileUpload } from "../../components/FIleUpload";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { paths } from "../../constants/path";
import Input from "../../components/Input";
import { sliderService } from "../../services/slider";
import { useNavigate } from "react-router";
import { otherLanguages } from "../../constants";

const defaultLanguage = { code: "en", name: "English" };


const schema = yup.object({
    displayOrder: yup.string().required("Display Order is required"),
    backgroundImage: yup.mixed<File>().required("Background Image is required"),

    title: yup.string().optional().default(""),
    subTitle: yup.string().optional().default(""),

    translations: yup
        .array()
        .of(
            yup.object({
                languageCode: yup.string().required(),
                title: yup.string().test(
                    'title-required',
                    'Title is required when default title is provided',
                    function(value) {
                        const parent = this.from?.[1]?.value;
                        const defaultTitle = parent?.title;
                        if (defaultTitle && defaultTitle.trim().length > 0) {
                            return value != null && value.trim().length > 0;
                        }
                        return true;
                    }
                ).optional().default(""),
                subTitle: yup.string().test(
                    'subtitle-required',
                    'Subtitle is required when default subtitle is provided',
                    function(value) {
                        const parent = this.from?.[1]?.value;
                        const defaultSubTitle = parent?.subTitle;
                        if (defaultSubTitle && defaultSubTitle.trim().length > 0) {
                            return value != null && value.trim().length > 0;
                        }
                        return true;
                    }
                ).optional().default(""),
            })
        )
        .required(),
});

type SliderFormType = yup.InferType<typeof schema>;

export default function SliderCreate() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<SliderFormType>({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: "0",
            backgroundImage: undefined,
            title: "",
            subTitle: "",
            translations: otherLanguages.map((lang) => ({
                languageCode: lang.code,
                title: "",
                subTitle: "",
            })),
        },
    });

    // Persist slider draft (omit backgroundImage)
    useFormDraft<SliderFormType>("create:slider", { reset, watch }, { omit: ["backgroundImage"] });

    const { fields } = useFieldArray({
        control,
        name: "translations",
    });

    const [activeLang, setActiveLang] = useState(
        otherLanguages.length > 0 ? otherLanguages[0].code : ""
    );

    const mutation = useMutation({
        mutationFn: (data: SliderFormType) =>
            sliderService.createSlider(data as any),
        onSuccess: () => {
            toast.success("Slider created successfully");
            reset();
            clearDraft("create:slider");
            navigate(paths.SLIDER.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to create Slider"
            );
        },
    });

    const onSubmit = async (data: SliderFormType) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.SLIDER.LIST);
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
                            Create Slider
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Add a new Slider
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Ümumi Sahələr */}
                    <Input
                        name="displayOrder"
                        control={control}
                        label="Display Order"
                        type="number"
                        error={errors.displayOrder?.message}
                        required={true}
                    />
                    <FileUpload
                        name="backgroundImage"
                        control={control}
                        label="Background Image"
                        error={errors.backgroundImage?.message as string}
                        accept="image/*"
                        description="Drag and drop an image here or click to browse (Max 100MB)"
                        required={true}
                    />

                    {/* Default Dil Sahələri */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Default Content ({defaultLanguage.name})
                        </h3>
                        <div className="mt-4 grid grid-cols-1 gap-6">
                            <Input
                                name="title"
                                control={control}
                                label="Title"
                                placeholder="Title"
                                error={errors.title?.message}
                                required={false}
                            />
                            <Input
                                name="subTitle"
                                control={control}
                                label="Sub Title"
                                placeholder="Sub Title"
                                error={errors.subTitle?.message}
                                required={false}
                            />
                        </div>
                    </div>

                    {/* Yalnız əlavə dillər üçün Tablar bloku */}
                    {otherLanguages.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Translations
                            </h3>
                            <div className="border-b border-gray-200">
                                <nav
                                    className="-mb-px flex space-x-8"
                                    aria-label="Tabs"
                                >
                                    {otherLanguages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() =>
                                                setActiveLang(lang.code)
                                            }
                                            className={`${
                                                activeLang === lang.code
                                                    ? "border-slate-500 text-slate-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Digər Dillər üçün Dinamik Inputlar */}
                            <div className="mt-6">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        style={{
                                            display:
                                                activeLang ===
                                                field.languageCode
                                                    ? "block"
                                                    : "none",
                                        }}
                                    >
                                        <div className="space-y-4">
                                            <Input
                                                name={`translations.${index}.title`}
                                                control={control}
                                                label="Title"
                                                placeholder="Title"
                                                error={
                                                    errors.translations?.[index]
                                                        ?.title?.message
                                                }
                                                required={false}
                                            />
                                            <Input
                                                name={`translations.${index}.subTitle`}
                                                control={control}
                                                label="Sub Title"
                                                placeholder="Sub Title"
                                                error={
                                                    errors.translations?.[index]
                                                        ?.subTitle?.message
                                                }
                                                required={false}
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
                            className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                        >
                            {mutation.isPending ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w.org/2000/svg"
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
                                    Creating...
                                </>
                            ) : (
                                "Create Slider"
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
