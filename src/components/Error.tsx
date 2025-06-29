export const ErrorMessage = ({ onRetry }: { onRetry?: () => void }) => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">Failed to load datas. Please try again.</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-dark text-white rounded-lg transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    </div>
);
