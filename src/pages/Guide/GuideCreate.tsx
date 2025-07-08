import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { paths } from "../../constants/path";
import { guideService } from "../../services/guide";

interface DestinationFormData {
    language:string;
    price:string;
}

const schema = yup.object({
    language: yup.string().required("Language is required"),
    price: yup.string().required("Price is required"),

});

export default function GuideCreate() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<DestinationFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            language:"",
            price:"",
        }
    });

    const mutation = useMutation({
        mutationFn: guideService.createGuide,
        onSuccess: () => {
            toast.success('Guide created successfully');
            reset();
            navigate(paths.GUIDE.LIST);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create Guide');
        }
    });

    const onSubmit = async (data: DestinationFormData) => {
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
