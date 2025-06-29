import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { packageTourService } from "../../../services/packageTour";
import { packageOptionService } from "../../../services/packageTour/option";
import { useEffect, useRef } from "react";
import { paths } from "../../../constants/path";

export default function TourOptionDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch package option data
    const {
        data: optionData,
        isPending: optionLoading,
        error: optionError,
    } = useQuery({
        queryKey: [QUERY_KEYS.packageOption.all, id],
        queryFn: () => packageOptionService.getOptionById(id!),
        enabled: !!id,
    });

    // Fetch package info for display
    const { data: packageData } = useQuery({
        queryKey: [QUERY_KEYS.packageOption.select],
        queryFn: packageTourService.getPackageSelect,
    });

    const option = optionData?.data?.packageOption;
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!viewerRef.current || !option?.vrImagePath) return;

        const viewer = pannellum.viewer(viewerRef.current, {
            type: "equirectangular",
            panorama: option.vrImagePath,
            crossOrigin: "anonymous",
            autoLoad: true,
            showControls: true,
            mouseZoom: true,
        });

        return () => {
            viewer.destroy();
        };
    }, [option?.vrImagePath]);

    const handleBack = () => {
        navigate(paths.PACKAGE_TOUR_OPTION.LIST);
    };

    const handleEdit = () => {
        navigate(paths.PACKAGE_TOUR_OPTION.EDIT(id));
    };

    // Get package name by ID
    const getPackageName = (packageId: string) => {
        const pkg = packageData?.data?.find((p:{key:string}) => p.key === packageId);
        return pkg?.value || "Unknown Package";
    };

    // Show loading state
    if (optionLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 text-lg font-medium">
                            Loading package option information...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (optionError || !option) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {optionError ? "Failed to Load Option" : "Option Not Found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {optionError
                            ? "There was an error loading the package option details."
                            : "The requested package option could not be found."}
                    </p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
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
                        Back to Options
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Back to options"
                            >
                                <svg
                                    className="w-6 h-6"
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
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {option.optionName}
                                </h1>
                                <p className="text-gray-600">
                                    Option ID: <span className="font-medium">{option.id}</span> •
                                    Package: <span className="font-medium">{getPackageName(option.packageId)}</span> •
                                    Display Order: <span className="font-medium">#{option.displayOrder}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit Option
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Price Information Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg
                            className="w-7 h-7 text-green-600 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Pricing Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-blue-800">Price</h3>
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-blue-900">${option.price}</p>
                            <p className="text-sm text-blue-600 mt-2">Per person</p>
                        </div>
                    </div>
                </div>

                {/* Accommodation and Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Apartment Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 text-purple-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Apartment Information
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {option.apartmentInfo}
                        </p>
                    </div>

                    {/* Room Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 text-blue-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                            Room Information
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {option.roomInfo}
                        </p>
                    </div>

                    {/* Vehicle Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <svg
                                className="w-6 h-6 text-green-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                            </svg>
                            Vehicle Information
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {option.vehicleInfo}
                        </p>
                    </div>
                </div>

                {/* Tour Images */}
                {option.travelPackageImages && option.travelPackageImages.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Package Images
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {option.travelPackageImages.map(
                                (image: {id: string; imagePath: string}, index: number) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                    >
                                        <img
                                            src={image.imagePath}
                                            alt={`${option.optionName} - Image ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Tour Description */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Package Overview
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Short Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed break-words">
                                {option.shortDescription}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Full Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed break-words">
                                {option.fullDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tour Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Inclusions */}
                    {option.includes && option.includes.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-6 h-6 text-green-600 mr-2"
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
                                Package Inclusions
                            </h3>
                            <ul className="space-y-3">
                                {option.includes.map(
                                    (item: string, index: number) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
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
                                            <span className="text-gray-700">
                                                {item}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Exclusions */}
                    {option.excludes && option.excludes.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-6 h-6 text-red-600 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Package Exclusions
                            </h3>
                            <ul className="space-y-3">
                                {option.excludes.map(
                                    (item: string, index: number) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <svg
                                                className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <span className="text-gray-700">
                                                {item}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Important Notes */}
                    {option.importantInfos && option.importantInfos.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <svg
                                    className="w-6 h-6 text-amber-600 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Important Notes
                            </h3>
                            <ul className="space-y-3">
                                {option.importantInfos.map(
                                    (info: string, index: number) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <svg
                                                className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-gray-700">
                                                {info}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* VR Experience */}
                {option.vrImagePath && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg
                                className="w-7 h-7 text-blue-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            Virtual Reality Preview
                        </h2>
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                            <div
                                ref={viewerRef}
                                className="w-full h-[450px] rounded-lg overflow-hidden"
                            />
                        </div>
                    </div>
                )}

                {/* Location Map */}
                {option.mapUrl && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg
                                className="w-7 h-7 text-red-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Package Location & Map
                        </h2>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <iframe
                                src={option.mapUrl}
                                width="100%"
                                height="450"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="border-0"
                                title={`Location map for ${option.optionName}`}
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
