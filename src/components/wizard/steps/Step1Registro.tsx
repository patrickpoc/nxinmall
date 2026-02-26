'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1Data } from '@/lib/schemas';
import { useOnboardingStore } from '@/lib/store';
import PhoneInput from '@/components/ui/PhoneInput';
import clsx from 'clsx';

const CARGOS = [
  'Gerente General',
  'Encargado de exportaciones',
  'Jefe comercial',
  'Dueño',
  'Otro',
];

const PAISES = ['Peru', 'Colombia', 'Ecuador', 'Chile', 'Bolivia', 'Brasil', 'Argentina', 'México', 'Otro'];

interface Step1Props {
  onNext: () => void;
}

export default function Step1Registro({ onNext }: Step1Props) {
  const { registro, setRegistro } = useOnboardingStore();

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
      {/* Nombre */}
      <div className="flex flex-col">
        <label className={labelClass}>Nombre completo *</label>
        <input
          {...register('nombre')}
          className={inputClass(errors.nombre)}
          placeholder="Tu nombre"
        />
        {errors.nombre && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.nombre.message}</p>}
      </div>

      {/* Empresa */}
      <div className="flex flex-col">
        <label className={labelClass}>Empresa *</label>
        <input
          {...register('empresa')}
          className={inputClass(errors.empresa)}
          placeholder="Nombre de tu empresa"
        />
        {errors.empresa && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.empresa.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className={labelClass}>Email corporativo *</label>
        <input
          {...register('email')}
          type="email"
          className={inputClass(errors.email)}
          placeholder="tu@empresa.com"
        />
        {errors.email && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.email.message}</p>}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col">
        <label className={labelClass}>WhatsApp *</label>
        <PhoneInput
          placeholder="999 999 999"
          value={whatsapp}
          onChange={(e) => setValue('whatsapp', e.target.value)}
          error={errors.whatsapp?.message}
        />
      </div>

      {/* RUC */}
      <div className="flex flex-col">
        <label className={labelClass}>
          RUC <span className="opacity-50 font-normal">(opcional)</span>
        </label>
        <input
          {...register('ruc')}
          className={inputClass(errors.ruc)}
          placeholder="20123456789"
          maxLength={11}
        />
        {errors.ruc && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.ruc.message}</p>}
      </div>

      {/* Cargo */}
      <div className="flex flex-col">
        <label className={labelClass}>Cargo *</label>
        <select {...register('cargo')} className={inputClass(errors.cargo)}>
          <option value="">Selecciona tu cargo</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.cargo && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.cargo.message}</p>}
      </div>

      {/* País */}
      <div className="flex flex-col sm:col-span-2">
        <label className={labelClass}>País *</label>
        <select {...register('pais')} className={inputClass(errors.pais)}>
          {PAISES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.pais && <p className="mt-1 ml-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">{errors.pais.message}</p>}
      </div>

      <div className="sm:col-span-2 mt-4">
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-brand-900 text-white font-bold text-base hover:bg-brand-900/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-brand-900/20"
        >
          Continuar →
        </button>
      </div>
    </form>
  );
}
