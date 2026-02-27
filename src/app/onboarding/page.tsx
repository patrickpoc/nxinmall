'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store';
import WizardShell from '@/components/wizard/WizardShell';
import Step1Registro from '@/components/wizard/steps/Step1Registro';
import Step2Perfil from '@/components/wizard/steps/Step2Perfil';
import Step3Ubicacion from '@/components/wizard/steps/Step3Ubicacion';
import Step4Catalogo from '@/components/wizard/steps/Step4Catalogo';
import Step5Resumen from '@/components/wizard/steps/Step5Resumen';
import { t } from '@/lib/i18n';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { meta, idioma, setCurrentStep, setRegistro } = useOnboardingStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.replace('/');
      return;
    }

    fetch(`/api/onboarding-invite/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('invalid');
        return res.json();
      })
      .then((data) => {
        setRegistro({
          ...(data.nombre   ? { nombre: data.nombre }   : {}),
          ...(data.empresa  ? { empresa: data.empresa }  : {}),
          ...(data.email    ? { email: data.email }    : {}),
          ...(data.whatsapp ? { whatsapp: data.whatsapp } : {}),
          ...(data.pais     ? { pais: data.pais }     : {}),
        });
        setReady(true);
      })
      .catch(() => {
        router.replace('/');
      });
  }, []);

  const currentStep = meta.currentStep;

  const stepMeta = [
    { title: t('step1Title', idioma), subtitle: t('step1Subtitle', idioma) },
    { title: t('step2Title', idioma), subtitle: t('step2Subtitle', idioma) },
    { title: t('step3Title', idioma), subtitle: t('step3Subtitle', idioma) },
    { title: t('step4Title', idioma), subtitle: t('step4Subtitle', idioma) },
    { title: t('step5Title', idioma), subtitle: t('step5Subtitle', idioma) },
  ][currentStep - 1];

  const goNext = () => setCurrentStep(Math.min(currentStep + 1, 5));
  const goBack = () => setCurrentStep(Math.max(currentStep - 1, 1));

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
