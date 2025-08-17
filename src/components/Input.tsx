import { Controller } from "react-hook-form";

export default function Input({
    name,
    control,
    label,
    type = "text",
    placeholder,
    required = false,
    error,
    mask,
    ...props
}: {
    name: string,
    control: any,
    label: string,
    type?: string,
    placeholder?: string,
    required?: boolean,
    error?: string,
    mask?: string,
}) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value, name: fieldName, ref } }) => (
                    <input
                        ref={ref}
                        name={fieldName}
                        type={type}
                        value={value ?? ''} // Ensure controlled component with fallback
                        onChange={onChange}
                        onBlur={onBlur}
                        autoFocus={type === "text"}
                        placeholder={placeholder}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                            error
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300"
                        }`}
                        {...props}
                    />
                )}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
