import { Controller } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

export default function Select({
    name,
    control,
    label,
    options = [],
    placeholder = "Select an option",
    required = false,
    error,
    isPending = false,
    // ...props
}: {
    name: string;
    control: any;
    label: string;
    options?: { key: string; value: string }[];
    placeholder?: string;
    required?: boolean;
    error?: string;
    isPending?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const LoadingSpinner = () => (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
    );

    const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
        <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? `${label} is required` : false }}
                render={({ field: { onChange, value } }) => (
                    <div className="relative" ref={selectRef}>
                        <div
                            className={`
                                relative w-full px-3 py-2 border rounded-lg cursor-pointer
                                bg-white transition-all duration-200 min-h-[2.5rem] flex items-center
                                ${error
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                    : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-200"
                                }
                                ${isOpen ? "ring-2 ring-opacity-50" : ""}
                                ${isPending ? "bg-gray-50" : ""}
                            `}
                            onClick={() => !isPending && setIsOpen(!isOpen)}
                        >
                            <div className="flex-1 flex items-center justify-between">
                                <span className={`${
                                    value
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                }`}>
                                    {value
                                        ? options.find(opt => opt.key === value)?.value
                                        : placeholder
                                    }
                                </span>

                                <div className="flex items-center space-x-2">
                                    {isPending && <LoadingSpinner />}
                                    <ChevronIcon isOpen={isOpen} />
                                </div>
                            </div>
                        </div>

                        {isOpen && !isPending && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {options.length === 0 ? (
                                    <div className="px-3 py-2 text-gray-500 text-sm">
                                        No options available
                                    </div>
                                ) : (
                                    options.map((option) => (
                                        <div
                                            key={option.key}
                                            className={`
                                                px-3 py-2 cursor-pointer transition-colors duration-150
                                                hover:bg-blue-50 hover:text-blue-700
                                                ${value === option.value
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-900"
                                                }
                                            `}
                                            onClick={() => {
                                                onChange(option.key);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {option.value}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
