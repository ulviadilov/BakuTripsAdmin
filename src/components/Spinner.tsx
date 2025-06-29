export default function Spinner({message}:{message:string}) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-dark rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 text-sm">{message}</p>
            </div>
        </div>
    );
}
