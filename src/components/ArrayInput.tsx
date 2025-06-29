import React, { useState, type KeyboardEvent } from 'react';
import {Controller } from 'react-hook-form';

interface ArrayInputProps {
    name:string;
    control: any;
    label: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    maxItems?: number;
    icon?: React.ReactNode;
}

export function ArrayInput({
    name,
    control,
    label,
    placeholder = "Add item...",
    required = false,
    error,
    maxItems,
    icon
}: ArrayInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        onChange: (value: string[]) => void,
        currentValues: string[]
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const trimmedValue = inputValue.trim();

            if (trimmedValue && !currentValues.includes(trimmedValue)) {
                if (!maxItems || currentValues.length < maxItems) {
                    onChange([...currentValues, trimmedValue]);
                    setInputValue('');
                }
            }
        }
    };

    const removeItem = (
        index: number,
        onChange: (value: string[]) => void,
        currentValues: string[]
    ) => {
        const newValues = currentValues.filter((_, i) => i !== index);
        onChange(newValues);
    };

    const addItem = (
        onChange: (value: string[]) => void,
        currentValues: string[]
    ) => {
        const trimmedValue = inputValue.trim();

        if (trimmedValue && !currentValues.includes(trimmedValue)) {
            if (!maxItems || currentValues.length < maxItems) {
                onChange([...currentValues, trimmedValue]);
                setInputValue('');
            }
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {icon && <span className="mr-2">{icon}</span>}
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {maxItems && (
                    <span className="text-gray-500 text-xs ml-2">
                        (Max {maxItems} items)
                    </span>
                )}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field: { value = [], onChange } }) => (
                    <div className="space-y-3">
                        {/* Input Field */}
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, onChange, value)}
                                placeholder={placeholder}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                disabled={maxItems ? value.length >= maxItems : false}
                            />
                            <button
                                type="button"
                                onClick={() => addItem(onChange, value)}
                                disabled={!inputValue.trim() || (maxItems ? value.length >= maxItems : false)}
                                className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {value.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600 font-medium">
                                    {label} ({value.length} {value.length === 1 ? 'item' : 'items'})
                                </div>
                                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-gray-50">
                                    {value.map((item: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm text-gray-800 flex-1 break-words">
                                                {item}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index, onChange, value)}
                                                className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                title="Remove item"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {value.length === 0 && (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                </svg>
                                <p className="text-sm">No {label.toLowerCase()} added yet</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Type above and press Enter to add items
                                </p>
                            </div>
                        )}
                    </div>
                )}
            />

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
