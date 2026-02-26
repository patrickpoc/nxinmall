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
      <div className="flex items-center gap-1.5">
        {STEPS.map((step) => (
          <div 
            key={step.number} 
            className={clsx(
              'h-1.5 flex-1 rounded-full transition-all duration-700 ease-in-out',
              step.number < currentStep
                ? 'bg-brand-900'
                : step.number === currentStep
                ? 'bg-brand-500 shadow-[0_0_10px_rgba(25,115,250,0.3)]'
                : 'bg-gray-100'
            )}
          />
        ))}
      </div>
    </div>
  );
}
