'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  defaultCountryCode?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, defaultCountryCode = '+51', className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-sm text-gray-600 font-medium">
            {defaultCountryCode}
          </span>
          <input
            ref={ref}
            type="tel"
            className={clsx(
              'flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-r-xl bg-white',
              'focus:outline-none focus:border-brand-900 transition-colors',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
