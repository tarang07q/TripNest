'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center">
          <input
            type="radio"
            ref={ref}
            className={`
              h-4 w-4 border-gray-300
              text-blue-600 focus:ring-blue-500
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          {label && (
            <span className="ml-2 text-sm text-gray-700">
              {label}
            </span>
          )}
        </label>
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio; 