'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useOnboardingStore } from '@/lib/store';
import WizardShell from '@/components/wizard/WizardShell';
import Step1Registro from '@/components/wizard/steps/Step1Registro';
import Step2Perfil from '@/components/wizard/steps/Step2Perfil';
import Step3Ubicacion from '@/components/wizard/steps/Step3Ubicacion';
import Step4Catalogo from '@/components/wizard/steps/Step4Catalogo';
import Step5Resumen from '@/components/wizard/steps/Step5Resumen';

const STEP_META = [
  { title: 'Datos básicos', subtitle: 'Cuéntanos quién eres y cómo contactarte.' },
  { title: 'Perfil de tu empresa', subtitle: 'Qué ofreces y cómo te quieres presentar.' },
  { title: 'Ubicación', subtitle: 'Indica desde dónde operas.' },
  { title: 'Tu catálogo de productos', subtitle: 'Selecciona los productos que exportas u ofreces.' },
  { title: 'Resumen y envío', subtitle: 'Revisa todo y envía tu perfil al equipo NxinMall.' },
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const { meta, setCurrentStep, setRegistro } = useOnboardingStore();

  useEffect(() => {
    const nombre = searchParams.get('nombre');
    const empresa = searchParams.get('empresa');
    const email = searchParams.get('email');
    if (nombre || empresa || email) {
      setRegistro({
        ...(nombre ? { nombre } : {}),
        ...(empresa ? { empresa } : {}),
        ...(email ? { email } : {}),
      });
    }
  }, []);

  const currentStep = meta.currentStep;
  const stepMeta = STEP_META[currentStep - 1];

  const goNext = () => setCurrentStep(Math.min(currentStep + 1, 5));
  const goBack = () => setCurrentStep(Math.max(currentStep - 1, 1));

  return (
    <WizardShell
      currentStep={currentStep}
      title={stepMeta.title}
      subtitle={stepMeta.subtitle}
      hideNav
    >
      {currentStep === 1 && <Step1Registro onNext={goNext} />}
      {currentStep === 2 && <Step2Perfil onNext={goNext} onBack={goBack} />}
      {currentStep === 3 && <Step3Ubicacion onNext={goNext} onBack={goBack} />}
      {currentStep === 4 && <Step4Catalogo onNext={goNext} onBack={goBack} />}
      {currentStep === 5 && <Step5Resumen onBack={goBack} />}
    </WizardShell>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
