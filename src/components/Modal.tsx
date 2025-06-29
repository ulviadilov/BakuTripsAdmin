import { useEffect, useState } from 'react';

export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    name,
    isDeleting,
    type
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
    isDeleting: boolean;
    type: string;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small delay to trigger the transition
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            // Wait for transition to complete before unmounting
            setTimeout(() => setShouldRender(false), 200);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ease-out ${
                    isVisible
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Delete {type}</h3>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Are you sure you want to delete the {type.toLowerCase()} <span className="font-medium text-gray-900">"{name}"</span>? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-5 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                        {isDeleting && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};
