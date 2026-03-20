'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStep1Schema, Step1Data } from '@/lib/schemas';
import { useOnboardingStore } from '@/lib/store';
import PhoneInput from '@/components/ui/PhoneInput';
import { t } from '@/lib/i18n';
import { getCountryPrefix } from '@/data/countries';
import CountryCombobox from '@/components/ui/CountryCombobox';
import clsx from 'clsx';

interface Step1Props {
  onNext: () => void;
}

export default function Step1Registro({ onNext }: Step1Props) {
  const { registro: registration, idioma: language, setRegistro: setRegistration } = useOnboardingStore();
  const step1Schema = useMemo(() => createStep1Schema(language), [language]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: registration.nombre,
      empresa: registration.empresa,
      ruc: registration.ruc,
      email: registration.email,
      whatsapp: registration.whatsapp,
      cargo: registration.cargo,
      pais: registration.pais || 'Peru',
    },
  });

  const whatsapp = watch('whatsapp');
  const selectedCountry = watch('pais');

  // Sync pais field when store changes (e.g. language toggle in header sets Brasil)
  useEffect(() => {
    setValue('pais', registration.pais || 'Peru');
  }, [registration.pais, setValue]);

  // Revalidate visible errors when language changes
  useEffect(() => {
    void trigger();
  }, [language, trigger]);

  const onSubmit = (data: Step1Data) => {
    setRegistration(data);
    onNext();
  };

  const inputClass = (error?: { message?: string }) =>
    clsx(
      'w-full px-4 py-3.5 text-sm rounded-2xl bg-gray-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300',
      error ? 'ring-2 ring-red-400/20 bg-red-50/30' : ''
    );

  const labelClass = "text-[11px] font-black text-brand-900/50 uppercase tracking-[0.2em] ml-1 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      {/* País (MOVIDO AL INICIO) */}
      <div className="flex flex-col sm:col-span-2">
        <label className={labelClass}>{t('paisPaso1Label', language)}</label>
        <CountryCombobox
          value={selectedCountry}
          onChange={(country) => setValue('pais', country)}
          placeholder={t('paisPaso1Label', language)}
          error={!!errors.pais}
        />
        {errors.pais && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pais.message}</p>}
      </div>

      {/* Nombre */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('nombreLabel', language)}</label>
        <input
          {...register('nombre')}
          className={inputClass(errors.nombre)}
          placeholder={t('nombrePlaceholder', language)}
        />
        {errors.nombre && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.nombre.message}</p>}
      </div>

      {/* Empresa */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('empresaLabel', language)}</label>
        <input
          {...register('empresa')}
          className={inputClass(errors.empresa)}
          placeholder={t('empresaPlaceholder', language)}
        />
        {errors.empresa && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.empresa.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('emailLabel', language)}</label>
        <input
          {...register('email')}
          type="email"
          className={inputClass(errors.email)}
          placeholder={t('emailPlaceholder', language)}
        />
        {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('whatsappLabel', language)}</label>
        <PhoneInput
          placeholder="999 999 999"
          value={whatsapp}
          onChange={(e) => setValue('whatsapp', e.target.value)}
          error={errors.whatsapp?.message}
          defaultCountryCode={getCountryPrefix(selectedCountry)}
        />
      </div>

      {/* RUC */}
      <div className="flex flex-col">
        <label className={labelClass}>
          {t('rucLabel', language)} <span className="opacity-50 font-normal lowercase tracking-normal">{t('opcional', language)}</span>
        </label>
        <input
          {...register('ruc')}
          className={inputClass(errors.ruc)}
          placeholder={t('rucPlaceholder', language)}
          maxLength={11}
        />
        {errors.ruc && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.ruc.message}</p>}
      </div>

      {/* Job title */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('cargoLabel', language)}</label>
        <input
          {...register('cargo')}
          className={inputClass(errors.cargo)}
          placeholder={t('cargoPlaceholder', language)}
          maxLength={50}
        />
        {errors.cargo && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.cargo.message}</p>}
      </div>

      <div className="sm:col-span-2 mt-4">
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-brand-900 text-white font-bold text-base hover:bg-brand-900/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnContinuar', language)}
        </button>
      </div>
    </form>
  );
}
