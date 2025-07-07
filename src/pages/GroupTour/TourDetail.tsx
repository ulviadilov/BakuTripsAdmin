import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { categoryService } from "../../services/category";
import { groupTourService } from "../../services/groupTour";
import { useEffect, useRef } from "react";
import { paths } from "../../constants/path";

export default function TourDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Fetch tour data
    const {
        data: tourData,
        isPending: tourLoading,
        error: tourError,
    } = useQuery({
        queryKey: [QUERY_KEYS.groupTour, id],
        queryFn: () => groupTourService.getById(id!),
        enabled: !!id,
    });

    // Fetch categories for category name display
    const { data: categoriesData } = useQuery({
        queryKey: [QUERY_KEYS.category],
        queryFn: categoryService.categeroySelect,
    });

    const tour = tourData?.data?.grouptour;
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!viewerRef.current || !tour?.vrImagePath) return;

        const viewer = pannellum.viewer(viewerRef.current, {
            type: "equirectangular",
            panorama: tour.vrImagePath,
            crossOrigin:"anonymous",
            autoLoad: true,
            showControls: true,
            mouseZoom: true,
        });

        return () => {
            viewer.destroy();
        };
    }, [tour?.vrImagePath]);

    const handleBack = () => {
        navigate(paths.GROUP_TOUR.LIST);
    };

    const handleEdit = () => {
        navigate(paths.GROUP_TOUR.EDIT(id));
    };

    // Get category name by ID
    const getCategoryName = (categoryId: string) => {
        const category = categoriesData?.data?.find(
            (cat) => cat.key === categoryId
        );
        return category?.value || "Unknown Category";
    };

    // Show loading state
    if (tourLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 text-lg font-medium">
                            Loading tour information...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (tourError || !tour) {
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
                        {tourError ? "Failed to Load Tour" : "Tour Not Found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {tourError
                            ? "There was an error loading the tour details."
                            : "The requested tour could not be found."}
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
                        Back to Tours
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
                                title="Back to tours"
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
                                <div className="flex items-center space-x-3 mb-1">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {tour.name}
                                    </h1>
                                    {tour.isPopular && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Popular Tour
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600">
                                    Tour ID:{" "}
                                    <span className="font-medium">
                                        {tour.id}
                                    </span>{" "}
                                    • Category:{" "}
                                    <span className="font-medium">
                                        {getCategoryName(tour.tourCategoryId)}
                                    </span>{" "}
                                    • Duration:{" "}
                                    <span className="font-medium">
                                        {tour.duration}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-tab hover:from-primary hover:to-tab text-white rounded-lg cursor-pointer transition-colors font-medium"
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
                            Edit Tour
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tour Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Tour Duration
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {tour.duration}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Tour Category
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {getCategoryName(tour.tourCategoryId)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Display Order
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    #{tour.order}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        tour.isPopular
                                            ? "bg-amber-100"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    <svg
                                        className={`w-6 h-6 ${
                                            tour.isPopular
                                                ? "text-amber-600"
                                                : "text-gray-600"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Tour Status
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {tour.isPopular
                                        ? "Popular Tour"
                                        : "Standard Tour"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-blue-800">Adults</h3>
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-blue-900">${tour.priceForAdult}</p>
                            <p className="text-sm text-blue-600 mt-2">Per person (12+ years)</p>
                        </div>

                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-purple-800">Children</h3>
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-purple-900">${tour.priceForChild}</p>
                            <p className="text-sm text-purple-600 mt-2">Per child (2-11 years)</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-amber-800">Infants</h3>
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-amber-900">
                                {tour.priceForInfant > 0 ? `$${tour.priceForInfant}` : 'Free'}
                            </p>
                            <p className="text-sm text-amber-600 mt-2">Under 2 years old</p>
                        </div>
                    </div>
                </div>

                {/* Main Tour Image */}
                {tour.posterImagePath && (
                    <div className="mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="aspect-[16/9] relative">
                                <img
                                    src={tour.posterImagePath}
                                    alt={`${tour.name} - Main tour image`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        Poster Image
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tour Description */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Tour Overview
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Brief Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {tour.shortDescription}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Detailed Information
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-wrap break-words">
                                {tour.fullDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tour Gallery */}
                {tour?.tourImages && tour?.tourImages.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Tour Photo Gallery
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {tour.tourImages.map(
                                (image: {id:string;imagePath:string}, index: number) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                    >
                                        <img
                                            src={image.imagePath}
                                            alt={`${
                                                tour.name
                                            } - Gallery image ${index + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Tour Itinerary */}
                {tour.tourPrograms && tour.tourPrograms.length > 0 && (
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
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            Tour Program
                        </h2>
                        <div className="space-y-4">
                            {tour.tourPrograms.map(
                                (program: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-6 bg-blue-50 border border-blue-100 rounded-xl"
                                    >
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-800 leading-relaxed">
                                                {program}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Tour Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Inclusions */}
                    {tour.includes && tour.includes.length > 0 && (
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
                                Tour Inclusions
                            </h3>
                            <ul className="space-y-3">
                                {tour.includes.map(
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
                    {tour.excludes && tour.excludes.length > 0 && (
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
                                Tour Exclusions
                            </h3>
                            <ul className="space-y-3">
                                {tour.excludes.map(
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
                    {tour.importantInfos && tour.importantInfos.length > 0 && (
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
                                {tour.importantInfos.map(
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
                {tour.vrImagePath && (
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
                {tour.googleMapUrl && (
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
                            Tour Location & Map
                        </h2>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <iframe
                                src={tour.googleMapUrl}
                                width="100%"
                                height="450"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="border-0"
                                title={`Location map for ${tour.name}`}
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
