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
      <div className="flex flex-col">
        <div className="flex shadow-sm rounded-2xl overflow-hidden">
          <span className="inline-flex items-center px-4 bg-gray-100 text-sm text-gray-500 font-black tracking-tight">
            {defaultCountryCode}
          </span>
          <input
            ref={ref}
            type="tel"
            className={clsx(
              'flex-1 px-4 py-3.5 text-sm bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all duration-300',
              error && 'ring-2 ring-red-400/20 bg-red-50/30',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
