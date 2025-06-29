import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { destinationService } from "../../services/destination";

export default function DestinationDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        data: destinationData,
        isPending: destinationLoading,
        error: destinationError,
    } = useQuery({
        queryKey: [QUERY_KEYS.destination, id],
        queryFn: () => destinationService.getById(id!),
        enabled: !!id,
    });

    const destination = destinationData?.destination;

    const handleBack = () => {
        navigate("/destinations");
    };

    const handleEdit = () => {
        navigate(`/destinations/edit/${id}`);
    };

    // Show loading state
    if (destinationLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 text-lg font-medium">
                            Loading destination information...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (destinationError || !destination) {
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
                        {destinationError
                            ? "Failed to Load Destination"
                            : "Destination Not Found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {destinationError
                            ? "There was an error loading the destination details."
                            : "The requested destination could not be found."}
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
                        Back to Destinations
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
                                title="Back to destinations"
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
                            <h1 className="text-2xl font-bold text-gray-900">
                                Destination Information
                            </h1>
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
                            Edit Destination
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Destination Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                                    Duration
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {destination.duration}
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
                                    #{destination.displayOrder}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Destination Image */}
                {destination.imageFile && (
                    <div className="mb-8">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="relative">
                                <img
                                    src={destination.imageFile}
                                    alt={`${destination.name} - Main image`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        Destination Image
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Destination Description */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Destination Overview
                    </h2>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed break-words">
                                {destination.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
