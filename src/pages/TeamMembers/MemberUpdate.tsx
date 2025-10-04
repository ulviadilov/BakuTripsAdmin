import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { paths } from "../../constants/path";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { useEffect, useState } from "react";
import Select from "../../components/Select";
import { memberService } from "../../services/member";
import { teamOptions, teamOptionsI18n } from "../../constants/team";
import { otherLanguages } from "../../constants";

interface MemberFormData {
    firstname: string;
    lastname: string;
    team: string;
    description: string;
    position: string;
    posterImage: File | null;
    hoverImage: File | null;
    translations: Array<{
        id?: string;
        languageCode: string;
        description: string;
        position: string;
    }>;
}

const schema = yup.object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    team: yup.string().required("Team is required"),
    description: yup
        .string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
    position: yup.string().required("Position is required"),
    posterImage: yup.mixed<File>().required().nullable(),
    hoverImage: yup.mixed<File>().required().nullable(),
    translations: yup
        .array()
        .of(
            yup
                .object({
                    languageCode: yup.string().required(),
                    description: yup
                        .string()
                        .required("Description is required")
                        .min(10, "Description must be at least 10 characters"),
                    position: yup.string().required("Position is required"),
                })
                .required()
        )
        .required(),
});

export default function MemberUpdate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        data: memberData,
        isPending: isMemberLoading,
        error: memberError,
    } = useQuery({
        queryKey: [QUERY_KEYS.member, id],
        queryFn: () => memberService.getMemberById(id!),
        enabled: !!id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MemberFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: "",
            lastname: "",
            team: "",
            description: "",
            position: "",
            posterImage: null,
            hoverImage: null,
            translations: otherLanguages.map((lang) => ({
                languageCode: lang.code,
                description: "",
                position: "",
            })),
        },
    });

    const { fields, replace } = useFieldArray({
        control,
        name: "translations",
    });

    const [activeLang, setActiveLang] = useState(
        otherLanguages.length > 0 ? otherLanguages[0].code : ""
    );

    useEffect(() => {
        if (memberData?.data) {
            const member = memberData.data.teamMember;
            reset({
                firstname: member.firstName || "",
                lastname: member.lastName || "",
                team: member.team || "",
                description: member.description || "",
                position: member.position || "",
                posterImage: null,
                hoverImage: null,
                translations: otherLanguages.map((lang) => {
                    const tr = member.translations?.find(
                        (t: any) => t.languageCode === lang.code
                    );
                    return {
                        languageCode: lang.code,
                        firstname: tr?.firstName || "",
                        lastname: tr?.lastName || "",
                        description: tr?.description || "",
                        position: tr?.position || "",
                        team: tr?.team || member.team || "",
                    };
                }),
            });
            // sync field array if needed
            replace(
                otherLanguages.map((lang) => {
                    const tr = member.translations?.find(
                        (t: any) => t.languageCode === lang.code
                    );
                    return {
                        languageCode: lang.code,
                        firstname: tr?.firstName || "",
                        lastname: tr?.lastName || "",
                        description: tr?.description || "",
                        position: tr?.position || "",
                        team: tr?.team || member.team || "",
                    };
                })
            );
        }
    }, [memberData, reset]);

    const mutation = useMutation({
        mutationFn: (data: MemberFormData) =>
            memberService.updateMember(id!, data),
        onSuccess: () => {
            toast.success("Member updated successfully");
            navigate(paths.MEMBER.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to update member"
            );
        },
    });

    const onSubmit = async (data: MemberFormData) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.MEMBER.LIST);
    };

    // Loading state
    if (isMemberLoading) {
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
                        <span className="text-gray-600">Loading member...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (memberError) {
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
                            Error Loading Member
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Unable to load member data. Please try again.
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
                            Edit Member
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Update member information
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            name="firstname"
                            control={control}
                            label="First Name (English)"
                            type="text"
                            placeholder="Enter first name"
                            required={true}
                            error={errors.firstname?.message}
                        />

                        <Input
                            name="lastname"
                            control={control}
                            label="Last Name (English)"
                            type="text"
                            placeholder="Enter last name"
                            required={true}
                            error={errors.lastname?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            name="team"
                            control={control}
                            label="Team"
                            placeholder="Enter team name"
                            required={true}
                            error={errors.team?.message}
                            options={teamOptions}
                        />

                        <Input
                            name="position"
                            control={control}
                            label="Position (English)"
                            type="text"
                            placeholder="Enter position"
                            required={true}
                            error={errors.position?.message}
                        />
                    </div>

                    <div className="grid grid-cols-1">
                        <Input
                            name="description"
                            control={control}
                            label="Description (English)"
                            type="textarea"
                            placeholder="Enter member description"
                            required={true}
                            error={errors.description?.message}
                        />
                    </div>

                    <FileUpload
                        name="posterImage"
                        control={control}
                        accept="image/*"
                        multiple={false}
                        maxSize={100}
                        maxFiles={1}
                        label="Update Poster Image"
                        description="Drag and drop an image here or click to browse (Max 100MB) - Leave empty to keep current image"
                        showPreview={true}
                        error={errors.posterImage?.message}
                        required={false}
                        initialUrls={
                            memberData?.data?.teamMember?.posterImagePath
                        }
                    />

                    <FileUpload
                        name="hoverImage"
                        control={control}
                        accept="image/*"
                        multiple={false}
                        maxSize={100}
                        maxFiles={1}
                        label="Update Funny Image"
                        description="Drag and drop an image here or click to browse (Max 100MB) - Leave empty to keep current image"
                        showPreview={true}
                        error={errors.hoverImage?.message}
                        required={false}
                        initialUrls={
                            memberData?.data?.teamMember?.hoverImagePath
                        }
                    />
                    {/* Translations Tabs */}
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

                            <div className="mt-6">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        style={{
                                            display:
                                                activeLang ===
                                                (field as any).languageCode
                                                    ? "block"
                                                    : "none",
                                        }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <Input
                                                name={`translations.${index}.position`}
                                                control={control}
                                                label="Position"
                                                type="text"
                                                placeholder="Enter position"
                                                required={true}
                                                error={
                                                    errors.translations?.[index]
                                                        ?.position?.message
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 mt-6">
                                            <Input
                                                name={`translations.${index}.description`}
                                                control={control}
                                                label="Description"
                                                type="textarea"
                                                placeholder="Enter member description"
                                                required={true}
                                                error={
                                                    errors.translations?.[index]
                                                        ?.description?.message
                                                }
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
                                    Update Member
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
