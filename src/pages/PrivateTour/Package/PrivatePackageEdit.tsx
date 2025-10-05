import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { privateTourService } from "../../../services/privateTour";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import type { PrivatePackageFormData } from "../../../services/privateTour/types";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import { useEffect, useState } from "react";
import { otherLanguages } from "../../../constants";

const schema = yup.object({
    tourid: yup.string().required("Tour Id is required"),
    price: yup.string().required("Price is required"),
    vehicleinfo: yup.string().required("Vehicle info is required")
});

export default function PrivatePackageEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: tourOptions, isPending: isLoadingTours } = useQuery({
        queryKey: [QUERY_KEYS.privateTour.select],
        queryFn: privateTourService.privateSelect
    });

    const { data: packageData, isPending: isLoadingPackage } = useQuery({
        queryKey: [QUERY_KEYS.privateTour.packages, id],
        queryFn: () => privateTourService.getPackageById(id!),
        enabled: !!id
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PrivatePackageFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            tourid: '',
            vehicleinfo: '',
            price: "",
            translations: otherLanguages.map((l) => ({ languageCode: l.code, vehicleinfo: "" })),
        }
    });

    const { fields } = useFieldArray({ control, name: "translations" });
    const [activeLang, setActiveLang] = useState<string>(otherLanguages[0]?.code || "az");

    useEffect(() => {
        if (packageData?.data) {
            const serverTranslations = packageData.data?.translations || packageData.data?.privateTourPackage?.translations || [];
            const translationsByLang: Record<string, string> = {};
            serverTranslations.forEach((tr: any) => {
                if (tr.languageCode && tr.vehicleInfo !== undefined) {
                    translationsByLang[tr.languageCode] = tr.vehicleInfo;
                }
            });

            console.log(translationsByLang);
            
            reset({
                tourid: packageData.data?.privateTourPackage.tourId || '',
                vehicleinfo: packageData.data?.privateTourPackage.vehicleInfo || '',
                price: packageData.data.privateTourPackage.price?.toString() || '',
                translations: otherLanguages.map((l) => ({
                    languageCode: l.code,
                    vehicleinfo: translationsByLang[l.code] ?? "",
                })),
            });
        }
    }, [packageData, reset]);

    const mutation = useMutation({
        mutationFn: (data: PrivatePackageFormData) =>
            privateTourService.updatePrivatePackage(id!, data),
        onSuccess: () => {
            toast.success('Private package updated successfully');
            navigate('/private-package');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update private package');
        }
    });

    const onSubmit = async (data: PrivatePackageFormData) => {
        const formData: PrivatePackageFormData = {
            ...data,
            price: data.price
        };
        mutation.mutate(formData);
    };

    const handleBack = () => {
        navigate('/private-package');
    };

    if (isLoadingPackage) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    <span className="ml-2 text-gray-600">Loading private package...</span>
                </div>
            </div>
        );
    }

    if (!packageData?.data && !isLoadingPackage) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Private Package Not Found</h2>
                    <p className="text-gray-600 mb-4">The private package you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBack}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                        Back to Private Packages
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
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Private Package</h1>
                        <p className="text-gray-600 text-sm mt-1">Update private package information</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            name="tourid"
                            control={control}
                            label="Tour Id"
                            placeholder="Select tour Id"
                            required={true}
                            isPending={isLoadingTours}
                            options={tourOptions?.data || []}
                            error={errors.tourid?.message}
                        />

                        <Input
                            name="vehicleinfo"
                            control={control}
                            label="Vehicle Info"
                            type="text"
                            placeholder="Enter vehicle info"
                            required={true}
                            error={errors.vehicleinfo?.message}
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

                    {/* Translations Tabs at bottom (only vehicleinfo) */}
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
                                            className={`${activeLang === lang.code ? "border-slate-500 text-slate-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} style={{ display: activeLang === field.languageCode ? 'block' : 'none' }}>
                                        <Input
                                            name={`translations.${index}.vehicleinfo`}
                                            control={control}
                                            label={`Vehicle Info (${field.languageCode.toUpperCase()})`}
                                            type="text"
                                            placeholder="Enter vehicle info"
                                        />
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
                                    Update Private Package
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
