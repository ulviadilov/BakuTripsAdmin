import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { paths } from "../../constants/path";
import Input from "../../components/Input";
import type { PromoCodeCreateRequest } from "../../services/promo/types";
import { promoService } from "../../services/promo";

const schema = yup.object({
    code: yup.string().required("Code is required"),
    discountPercent: yup
        .number()
        .typeError("Discount Percent must be a number")
        .min(0, "Discount Percent must be at least 0")
        .max(100, "Discount Percent must not exceed 100")
        .required("Discount Percent is required"),
    isActive: yup.boolean().required("Is Active is required"),
    maxUsageCount: yup
        .number()
        .typeError("Max Usage Count must be a number")
        .min(1, "Max Usage Count must be at least 1")
        .required("Max Usage Count is required"),
    minOrderAmount: yup
        .number()
        .typeError("Min Order Amount must be a number")
        .min(0, "Min Order Amount must be at least 0")
        .required("Min Order Amount is required"),
    maxDiscountAmount: yup
        .number()
        .typeError("Max Discount Amount must be a number")
        .min(0, "Max Discount Amount must be at least 0")
        .required("Max Discount Amount is required"),
});
export default function PromoCodeCreate() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PromoCodeCreateRequest>({
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
            discountPercent: 0,
            isActive: true,
            maxUsageCount: 1,
            minOrderAmount: 0,
            maxDiscountAmount: 0,
        },
    });

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: promoService.createPromoCode,
        onSuccess: () => {
            toast.success("Promo Code created successfully");
            reset();
            navigate(paths.PROMO_CODES.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to create Promo Code"
            );
        },
    });

    const onSubmit = async (data: PromoCodeCreateRequest) => {
        mutation.mutate(data);
    };

    const handleBack = () => {
        navigate(paths.PROMO_CODES.LIST);
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
                            Create Promo code
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Add a new promo code
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Input
                            name="code"
                            control={control}
                            label="Promo Code"
                            type="text"
                            placeholder="Enter promo code"
                            required={true}
                            error={errors.code?.message}
                        />
                        <Input
                            name="discountPercent"
                            control={control}
                            label="Discount Percentage"
                            type="text"
                            placeholder="Enter discount percentage"
                            required={true}
                            error={errors.discountPercent?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                        <Input
                            name="maxUsageCount"
                            control={control}
                            label="Maximum Usage Count"
                            type="text"
                            placeholder="Enter maximum usage count"
                            required={true}
                            error={errors.maxUsageCount?.message}
                        />
                        <Input
                            name="minOrderAmount"
                            control={control}
                            label="Minimum Order Amount"
                            type="text"
                            placeholder="Enter minimum order amount"
                            required={true}
                            error={errors.minOrderAmount?.message}
                        />
                        <Input
                            name="maxDiscountAmount"
                            control={control}
                            label="Maximum Discount Amount"
                            type="text"
                            placeholder="Enter maximum discount amount"
                            required={true}
                            error={errors.maxDiscountAmount?.message}
                        />
                    </div>
                    <label className="block text-sm font-medium text-gray-700">
                        Is Active Promo Code
                    </label>
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.checked)
                                    }
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-600">
                                    Mark as Active
                                </label>
                            </div>
                        )}
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
                                    Creating...
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
                                    Create Promo Code
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
