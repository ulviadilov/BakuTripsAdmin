import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router";
import Input from "../../../components/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { contactService } from "../../../services/settings/contact";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner";
import { ErrorMessage } from "../../../components/Error";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { paths } from "../../../constants/path";

const schema = yup.object().shape({
    displayOrder: yup
        .string()
        .required("Display order is required")
        .min(0, "Display order must be 0 or greater"),
    corporateNumber: yup.string().required("Corporate number is required"),
    corporateMail: yup
        .string()
        .email("Invalid email format")
        .required("Corporate email is required"),
    location: yup.string().required("Location is required"),
    workingHours: yup.string().required("Working hours are required"),
    mapUrl: yup
        .string()
        .url("Invalid URL format")
        .required("Map URL is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            displayOrder: "0",
            corporateNumber: "",
            corporateMail: "",
            location: "",
            workingHours: "",
            mapUrl: "",
        },
    });

    // Fetch contact data
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [QUERY_KEYS.contact, id],
        queryFn: () => contactService.getById(id!),
        enabled: !!id,
    });

    // Update mutation
    const mutation = useMutation({
        mutationFn: (data: FormData) => contactService.update(id!, {
            ...data,
            displayOrder:Number(data.displayOrder)
        }),
        onSuccess: () => {
            toast.success("Contact updated successfully");
            navigate(paths.SETTING.CONTACT.LIST);
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to update contact");
        },
    });


    useEffect(() => {
        if (data?.data) {
            const contactData = data.data.contactinfo;
            reset({
                displayOrder: contactData.displayOrder?.toString() ?? "0",
                corporateNumber: contactData.corporateNumber || "",
                corporateMail: contactData.corporateMail || "",
                location: contactData.location || "",
                workingHours: contactData.workingHours || "",
                mapUrl: contactData.mapUrl || "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (data: FormData) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.SETTING.CONTACT.LIST);
    };

    const handleRetry = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Spinner message="Loading contact information..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <ErrorMessage onRetry={handleRetry} />
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
                            Edit Contact
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Update contact information
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        name="corporateNumber"
                        control={control}
                        label="Corporate Number"
                        type="text"
                        placeholder="Enter corporate number"
                        required={true}
                        error={errors.corporateNumber?.message}
                    />

                    <Input
                        name="corporateMail"
                        control={control}
                        label="Corporate Email"
                        type="email"
                        placeholder="Enter corporate email"
                        required={true}
                        error={errors.corporateMail?.message}
                    />

                    <Input
                        name="location"
                        control={control}
                        label="Location"
                        type="text"
                        placeholder="Enter location"
                        required={true}
                        error={errors.location?.message}
                    />

                    <Input
                        name="workingHours"
                        control={control}
                        label="Working Hours"
                        type="text"
                        placeholder="Enter working hours (e.g., Mon-Fri 9:00-18:00)"
                        required={true}
                        error={errors.workingHours?.message}
                    />

                    <Input
                        name="mapUrl"
                        control={control}
                        label="Map URL"
                        type="url"
                        placeholder="Enter map URL"
                        required={true}
                        error={errors.mapUrl?.message}
                    />

                    <iframe
                        src={data?.data.contactinfo.mapUrl}
                        width="100%"
                        height="450"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

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
                                    Update Contact
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
