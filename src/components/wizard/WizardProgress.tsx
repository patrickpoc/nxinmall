'use client';

import clsx from 'clsx';

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export default function WizardProgress({ currentStep, totalSteps = 5 }: WizardProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5">
        {steps.map((step) => (
          <div 
            key={step}
            className={clsx(
              'h-1.5 flex-1 rounded-full transition-all duration-700 ease-in-out',
              step < currentStep
                ? 'bg-brand-900'
                : step === currentStep
                ? 'bg-brand-500 shadow-[0_0_10px_rgba(25,115,250,0.3)]'
                : 'bg-gray-100'
            )}
          />
        ))}
      </div>
    </div>
  );
}
