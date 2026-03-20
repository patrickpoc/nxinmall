'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/store';
import WizardShell from '@/components/wizard/WizardShell';
import Step1Registro from '@/components/wizard/steps/Step1Registro';
import Step3Ubicacion from '@/components/wizard/steps/Step3Ubicacion';
import Step5BuyerResumen from '@/components/wizard/steps/Step5BuyerResumen';

function OnboardingBuyerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { meta, idioma: language, setCurrentStep, initSession } = useOnboardingStore();
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
      .then(({ categoria, lead_type, document_person_type, document_type, document_number, document_deferred, ...rest }) => {
        if (lead_type && lead_type !== 'buyer') {
          router.replace(`/onboarding?token=${token}`);
          return;
        }
        initSession(token, {
          ...rest,
          leadType: 'buyer',
          documentPersonType: document_person_type ?? '',
          documentType: document_type ?? '',
          documentNumber: document_number ?? '',
          documentDeferred: Boolean(document_deferred),
          categoriaInteres: categoria ?? undefined,
        });
        setReady(true);
      })
      .catch(() => {
        router.replace('/');
      });
  }, []);

  const currentStep = Math.min(meta.currentStep, 3);
  const titleByStep = [
    language === 'pt' ? 'Dados básicos do comprador' : language === 'es' ? 'Datos básicos del comprador' : 'Buyer basic details',
    language === 'pt' ? 'Localização de compra' : language === 'es' ? 'Ubicación de compra' : 'Buying location',
    language === 'pt' ? 'Resumo e envio' : language === 'es' ? 'Resumen y envío' : 'Summary and submit',
  ];
  const subtitleByStep = [
    language === 'pt' ? 'Conte quem você é e como podemos te contatar.' : language === 'es' ? 'Cuéntanos quién eres y cómo podemos contactarte.' : 'Tell us who you are and how we can contact you.',
    language === 'pt' ? 'Informe onde sua operação de compra está baseada.' : language === 'es' ? 'Indica dónde está basada tu operación de compra.' : 'Tell us where your buying operation is based.',
    language === 'pt' ? 'Revise e envie seu perfil para o time NxinMall.' : language === 'es' ? 'Revisa y envía tu perfil al equipo NxinMall.' : 'Review and submit your profile to the NxinMall team.',
  ];

  const goNext = () => setCurrentStep(Math.min(currentStep + 1, 3));
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
      totalSteps={3}
      title={titleByStep[currentStep - 1]}
      subtitle={subtitleByStep[currentStep - 1]}
      hideNav
    >
      {currentStep === 1 && <Step1Registro onNext={goNext} />}
      {currentStep === 2 && <Step3Ubicacion onNext={goNext} onBack={goBack} />}
      {currentStep === 3 && <Step5BuyerResumen onBack={goBack} />}
    </WizardShell>
  );
}

export default function OnboardingBuyerPage() {
  return (
    <Suspense>
      <OnboardingBuyerContent />
    </Suspense>
  );
}
