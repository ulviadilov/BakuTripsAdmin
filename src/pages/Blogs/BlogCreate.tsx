import { useState } from "react";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { otherLanguages } from "../../constants";
import { useMutation } from "@tanstack/react-query";
import { blogsService } from "../../services/blogs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { paths } from "../../constants/path";

interface FormValues {
    AuthorName: string;
    MainTitle: string;
    MainDescription: string;
    SubTitle?: string;
    SubDescription?: string;
    FirstImageFile?: File | null;
    SecondImageFile?: File | null;
    FirstVideoUrl?: string;
    SecondVideoUrl?: string;
    Translations: {
        languageCode: string;
        mainTitle?: string;
        mainDescription?: string;
        subTitle?: string;
        subDescription?: string;
    }[];
}

const schema: yup.ObjectSchema<FormValues> = yup
    .object({
        AuthorName: yup.string().required(),
        MainTitle: yup.string().required(),
        MainDescription: yup.string().required(),
        SubTitle: yup.string().optional(),
        SubDescription: yup.string().optional(),
        FirstImageFile: yup.mixed<File>().nullable().optional(),
        SecondImageFile: yup.mixed<File>().nullable().optional(),
        FirstVideoUrl: yup.string().url().optional(),
        SecondVideoUrl: yup.string().url().optional(),
        Translations: yup
            .array()
            .of(
                yup.object({
                    languageCode: yup.string().required(),
                    mainTitle: yup.string().optional(),
                    mainDescription: yup.string().optional(),
                    subTitle: yup.string().optional(),
                    subDescription: yup.string().optional(),
                })
            )
            .required(),
    })
    .required();

export default function BlogCreate() {
    const navigate = useNavigate();
    const [activeLang, setActiveLang] = useState<string>(
        otherLanguages[0]?.code || "az"
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            AuthorName: "",
            MainTitle: "",
            MainDescription: "",
            SubTitle: "",
            SubDescription: "",
            FirstImageFile: undefined,
            SecondImageFile: undefined,
            FirstVideoUrl: "",
            SecondVideoUrl: "",
            Translations: otherLanguages.map((l) => ({
                languageCode: l.code,
                mainTitle: "",
                mainDescription: "",
                subTitle: "",
                subDescription: "",
            })),
        },
    });

    const { fields } = useFieldArray({ control, name: "Translations" });

    const mutation = useMutation({
        mutationFn: (data: FormValues) => blogsService.create(data),
        onSuccess: () => {
            toast.success("Blog created successfully");
            navigate(paths.BLOG.LIST);
        },
        onError: () => toast.error("Failed to create blog"),
    });

    const onSubmit = (data: FormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(paths.BLOG.LIST)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Go back"
                        type="button"
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
                            Create Blog
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Add a new blog post
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            name="AuthorName"
                            control={control}
                            label="Author Name"
                            type="text"
                            placeholder="Enter author name"
                        />
                        <Input
                            name="MainTitle"
                            control={control}
                            label="Main Title"
                            type="text"
                            placeholder="Enter main title"
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Main Description
                            </label>
                            <Controller
                                name="MainDescription"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={4}
                                        placeholder="Enter main description"
                                    />
                                )}
                            />
                            {errors.MainDescription && (
                                <p className="text-red-500 text-sm">
                                    Main description is required
                                </p>
                            )}
                        </div>
                        <Input
                            name="SubTitle"
                            control={control}
                            label="Sub Title"
                            type="text"
                            placeholder="Enter sub title"
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Sub Description
                            </label>
                            <Controller
                                name="SubDescription"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Enter sub description"
                                    />
                                )}
                            />
                        </div>
                        <Input
                            name="FirstVideoUrl"
                            control={control}
                            label="First Video URL"
                            type="text"
                            placeholder="https://..."
                        />
                        <Input
                            name="SecondVideoUrl"
                            control={control}
                            label="Second Video URL"
                            type="text"
                            placeholder="https://..."
                        />
                        <FileUpload
                            name="FirstImageFile"
                            control={control}
                            label="First Image"
                            accept="image/*"
                            multiple={false}
                        />
                        <FileUpload
                            name="SecondImageFile"
                            control={control}
                            label="Second Image"
                            accept="image/*"
                            multiple={false}
                        />
                    </div>

                    {otherLanguages.length > 0 && (
                        <div className="pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Translations
                            </h3>
                            <div className="border-b border-gray-200">
                                {otherLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
                                            activeLang === lang.code
                                                ? "border-slate-500 text-slate-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                        onClick={() => setActiveLang(lang.code)}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>

                            {fields.map((field, idx) => (
                                <div
                                    key={field.id}
                                    style={{
                                        display:
                                            activeLang ===
                                            otherLanguages[idx]?.code
                                                ? "block"
                                                : "none",
                                    }}
                                    className="mt-4"
                                >
                                    <Input
                                        name={`Translations.${idx}.mainTitle`}
                                        control={control}
                                        label={`Main Title (${otherLanguages[
                                            idx
                                        ]?.code.toUpperCase()})`}
                                        type="text"
                                        placeholder="Enter main title"
                                    />
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Main Description (
                                            {otherLanguages[
                                                idx
                                            ]?.code.toUpperCase()}
                                            )
                                        </label>
                                        <Controller
                                            name={
                                                `Translations.${idx}.mainDescription` as const
                                            }
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={3}
                                                    placeholder="Enter main description"
                                                />
                                            )}
                                        />
                                    </div>
                                    <Input
                                        name={`Translations.${idx}.subTitle`}
                                        control={control}
                                        label={`Sub Title (${otherLanguages[
                                            idx
                                        ]?.code.toUpperCase()})`}
                                        type="text"
                                        placeholder="Enter sub title"
                                    />
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sub Description (
                                            {otherLanguages[
                                                idx
                                            ]?.code.toUpperCase()}
                                            )
                                        </label>
                                        <Controller
                                            name={
                                                `Translations.${idx}.subDescription` as const
                                            }
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows={3}
                                                    placeholder="Enter sub description"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="submit"
                            className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Creating..." : "Create Blog"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(paths.BLOG.LIST)}
                            disabled={mutation.isPending}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
