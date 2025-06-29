import { useEffect, useRef, useState } from "react";
import { Controller} from "react-hook-form";

// Option interface
interface Option {
  value: string;
  label: string;
}

// MultiSelect component props interface
interface MultiSelectProps{
  name:string;
  control: any;
  label: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  height?: string;
}

export default function MultiSelect({
  name,
  control,
  label,
  options = [],
  placeholder = "Select options",
  required = false,
  error,
//   ...props
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (
    optionValue: string,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void
  ) => {
    const newValue = currentValue || [];
    if (newValue.includes(optionValue)) {
      // Remove option
      onChange(newValue.filter(val => val !== optionValue));
    } else {
      // Add option
      onChange([...newValue, optionValue]);
    }
  };

  const removeOption = (
    optionValue: string,
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void
  ) => {
    const newValue = currentValue || [];
    onChange(newValue.filter(val => val !== optionValue));
  };

  const selectAll = (
    currentValue: string[] | undefined,
    onChange: (value: string[]) => void
  ) => {
    if (currentValue?.length === options.length) {
      // Deselect all
      onChange([]);
    } else {
      // Select all
      onChange(options.map(opt => opt.value));
    }
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="relative">
            {/* Main Select Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-left bg-white ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={value?.length ? 'text-gray-900' : 'text-gray-500'}>
                  {value?.length ? `${value.length} selected` : placeholder}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Select All Option */}
                <div
                  onClick={() => selectAll(value, onChange)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-200 font-medium text-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {value?.length === options.length ? 'Deselect All' : 'Select All'}
                    </span>
                    <div className="flex items-center">
                      {value?.length === options.length ? (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Options */}
                {options.map((option) => {
                  const isSelected = value?.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => toggleOption(option.value, value, onChange)}
                      className={`px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className={isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'}>
                        {option.label}
                      </span>
                      <div className="flex items-center">
                        {isSelected ? (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected Values Display */}
            {value && value.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {value.map((val: string) => {
                    const option = options.find(opt => opt.value === val);
                    return (
                      <span
                        key={val}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {option?.label || val}
                        <button
                          type="button"
                          onClick={() => removeOption(val, value, onChange)}
                          className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
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
