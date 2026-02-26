'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1Data } from '@/lib/schemas';
import { useOnboardingStore } from '@/lib/store';
import PhoneInput from '@/components/ui/PhoneInput';
import { t } from '@/lib/i18n';
import clsx from 'clsx';

const CARGOS = [
  'Gerente General',
  'Encargado de exportaciones',
  'Jefe comercial',
  'Dueño',
  'Otro',
];

const PAISES = ['Peru', 'Colombia', 'Ecuador', 'Chile', 'Bolivia', 'Brasil', 'Argentina', 'México', 'Otro'];

const PREFIJOS: Record<string, string> = {
  Peru: '+51',
  Colombia: '+57',
  Ecuador: '+593',
  Chile: '+56',
  Bolivia: '+591',
  Brasil: '+55',
  Argentina: '+54',
  México: '+52',
  Otro: '+',
};

interface Step1Props {
  onNext: () => void;
}

export default function Step1Registro({ onNext }: Step1Props) {
  const { registro, idioma, setRegistro } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: registro.nombre,
      empresa: registro.empresa,
      ruc: registro.ruc,
      email: registro.email,
      whatsapp: registro.whatsapp,
      cargo: registro.cargo,
      pais: registro.pais || 'Peru',
    },
  });

  const whatsapp = watch('whatsapp');
  const paisSeleccionado = watch('pais');

  const onSubmit = (data: Step1Data) => {
    setRegistro(data);
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
        <label className={labelClass}>{t('paisPaso1Label', idioma)}</label>
        <select {...register('pais')} className={inputClass(errors.pais)}>
          {PAISES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.pais && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pais.message}</p>}
      </div>

      {/* Nombre */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('nombreLabel', idioma)}</label>
        <input
          {...register('nombre')}
          className={inputClass(errors.nombre)}
          placeholder={t('nombrePlaceholder', idioma)}
        />
        {errors.nombre && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.nombre.message}</p>}
      </div>

      {/* Empresa */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('empresaLabel', idioma)}</label>
        <input
          {...register('empresa')}
          className={inputClass(errors.empresa)}
          placeholder={t('empresaPlaceholder', idioma)}
        />
        {errors.empresa && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.empresa.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('emailLabel', idioma)}</label>
        <input
          {...register('email')}
          type="email"
          className={inputClass(errors.email)}
          placeholder={t('emailPlaceholder', idioma)}
        />
        {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('whatsappLabel', idioma)}</label>
        <PhoneInput
          placeholder="999 999 999"
          value={whatsapp}
          onChange={(e) => setValue('whatsapp', e.target.value)}
          error={errors.whatsapp?.message}
          defaultCountryCode={PREFIJOS[paisSeleccionado] || '+51'}
        />
      </div>

      {/* RUC */}
      <div className="flex flex-col">
        <label className={labelClass}>
          {t('rucLabel', idioma)} <span className="opacity-50 font-normal lowercase tracking-normal">{t('opcional', idioma)}</span>
        </label>
        <input
          {...register('ruc')}
          className={inputClass(errors.ruc)}
          placeholder={t('rucPlaceholder', idioma)}
          maxLength={11}
        />
        {errors.ruc && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.ruc.message}</p>}
      </div>

      {/* Cargo */}
      <div className="flex flex-col">
        <label className={labelClass}>{t('cargoLabel', idioma)}</label>
        <select {...register('cargo')} className={inputClass(errors.cargo)}>
          <option value="">{t('cargoPlaceholder', idioma)}</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.cargo && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.cargo.message}</p>}
      </div>

      <div className="sm:col-span-2 mt-4">
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-brand-900 text-white font-bold text-base hover:bg-brand-900/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          {t('btnContinuar', idioma)}
        </button>
      </div>
    </form>
  );
}
