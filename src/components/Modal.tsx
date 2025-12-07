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

export const StatusChangeModal = ({
    isOpen,
    onClose,
    onConfirm,
    orderNumber,
    currentStatus,
    newStatus,
    isChanging
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderNumber: string;
    currentStatus: string;
    newStatus: string;
    isChanging: boolean;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 200);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'refund':
            case 'refunded':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'pending':
                return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

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
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Change Order Status</h3>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                    Are you sure you want to change the status of order <span className="font-medium text-gray-900">#{orderNumber}</span>?
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-1">Current Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentStatus)}`}>
                                {currentStatus}
                            </span>
                        </div>
                        <svg className="w-6 h-6 text-gray-400 mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-1">New Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(newStatus)}`}>
                                {newStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isChanging}
                        className="px-5 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isChanging}
                        className="px-5 py-2.5 cursor-pointer bg-primary text-white rounded-lg transition-all duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                        {isChanging && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isChanging ? 'Changing...' : 'Confirm Change'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RefundItemModal = ({
    isOpen,
    onClose,
    onConfirm,
    tourName,
    isRefunding
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tourName: string;
    isRefunding: boolean;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Refund Order Item</h3>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                    Are you sure you want to refund this item?
                </p>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-xs text-red-600 font-semibold mb-2">Item to Refund:</p>
                    <p className="text-base font-bold text-red-900">{tourName}</p>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    This action will process a refund for this specific order item. The order status may be updated accordingly.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isRefunding}
                        className="px-5 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isRefunding}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-150 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                    >
                        {isRefunding && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isRefunding ? 'Processing...' : 'Confirm Refund'}
                    </button>
                </div>
            </div>
        </div>
    );
};
