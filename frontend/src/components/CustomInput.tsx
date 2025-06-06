// frontend/src/components/CustomInput.tsx
import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  errorValue?: string;
  suffix?: React.ReactNode;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  id,
  name,
  errorValue,
  suffix,
  className,
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className={`mt-1 block w-full px-3 py-2 border ${errorValue ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        {...props}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-sm leading-5">
          {suffix}
        </div>
      )}
      {errorValue && (
        <p className="mt-1 text-sm text-red-600">{errorValue}</p>
      )}
    </div>
  );
};

export default CustomInput;