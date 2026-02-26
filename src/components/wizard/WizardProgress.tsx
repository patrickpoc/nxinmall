'use client';

import clsx from 'clsx';

const STEPS = [
  { number: 1, label: 'Registro' },
  { number: 2, label: 'Perfil' },
  { number: 3, label: 'Ubicación' },
  { number: 4, label: 'Catálogo' },
  { number: 5, label: 'Resumen' },
];

interface WizardProgressProps {
  currentStep: number;
}

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-0">
        {STEPS.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Segment */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={clsx(
                  'h-1.5 w-full rounded-full transition-all duration-700 ease-in-out',
                  step.number < currentStep
                    ? 'bg-brand-900'
                    : step.number === currentStep
                    ? 'bg-brand-500'
                    : 'bg-gray-200'
                )}
              />
              <div className="flex items-center gap-1 mt-1.5">
                <span
                  className={clsx(
                    'text-xs font-medium transition-colors duration-500',
                    step.number <= currentStep ? 'text-brand-900' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
