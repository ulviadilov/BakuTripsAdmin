import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import Input from "../../components/Input";
import { authService } from "../../services/auth";

import TravelIllustration from "../../assets/World-Travel-PNG-Photos.png";
import Logo from "../../assets/logo.jpg";
import { paths } from "../../constants/path";

interface LoginFormData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function LoginPage() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            toast.success("Login successful");
            localStorage.setItem("token", data?.data?.token);
            reset();
            navigate(paths.DASHBOARD);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Login failed");
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-30 mix-blend-multiply"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-200 rounded-full filter blur-3xl opacity-30 mix-blend-multiply"></div>

            <div className="relative z-10 w-full max-w-6xl mx-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                    <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                        <img
                            src={TravelIllustration}
                            alt="Travel illustration"
                            className="w-full max-w-md mb-8 rounded-3xl opacity-50 grayscale-50"
                        />
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Explore the World
                            </h2>
                            <p className="text-blue-100">
                                Join thousands of travelers discovering amazing
                                destinations around the globe.
                            </p>
                        </div>

                        <div className="absolute top-8 left-8 w-16 h-16 border-4 border-white rounded-full opacity-20"></div>
                        <div className="absolute bottom-8 right-8 w-24 h-24 border-4 border-white rounded-full opacity-20"></div>
                    </div>

                    <div className="p-8 sm:p-12">
                        <div className="flex justify-center mb-8">
                            <img
                                src={Logo}
                                alt="Company Logo"
                                className="h-12"
                            />
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600">
                                Sign in to access your travel dashboard
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <Input
                                name="email"
                                control={control}
                                label="Email Address"
                                type="email"
                                placeholder="your@email.com"
                                required={true}
                                error={errors.email?.message}
                            />

                            <Input
                                name="password"
                                control={control}
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                required={true}
                                error={errors.password?.message}
                            />

                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="-ml-1 mr-3 h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Sign in
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
