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
      'w-full px-3 py-2.5 text-sm border rounded-xl bg-white focus:outline-none focus:border-brand-900 transition-colors',
      error ? 'border-red-400' : 'border-gray-200'
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Nombre completo *</label>
        <input
          {...register('nombre')}
          className={inputClass(errors.nombre)}
          placeholder="Tu nombre"
        />
        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
      </div>

      {/* Empresa */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Empresa *</label>
        <input
          {...register('empresa')}
          className={inputClass(errors.empresa)}
          placeholder="Nombre de tu empresa"
        />
        {errors.empresa && <p className="text-xs text-red-500">{errors.empresa.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Email corporativo *</label>
        <input
          {...register('email')}
          type="email"
          className={inputClass(errors.email)}
          placeholder="tu@empresa.com"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <PhoneInput
          label="WhatsApp *"
          placeholder="999 999 999"
          value={whatsapp}
          onChange={(e) => setValue('whatsapp', e.target.value)}
          error={errors.whatsapp?.message}
        />
      </div>

      {/* RUC */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          RUC <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <input
          {...register('ruc')}
          className={inputClass(errors.ruc)}
          placeholder="20123456789"
          maxLength={11}
        />
        {errors.ruc && <p className="text-xs text-red-500">{errors.ruc.message}</p>}
      </div>

      {/* Cargo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Cargo *</label>
        <select {...register('cargo')} className={inputClass(errors.cargo)}>
          <option value="">Selecciona tu cargo</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.cargo && <p className="text-xs text-red-500">{errors.cargo.message}</p>}
      </div>

      {/* País */}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="text-sm font-medium text-ink">País *</label>
        <select {...register('pais')} className={inputClass(errors.pais)}>
          {PAISES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.pais && <p className="text-xs text-red-500">{errors.pais.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-brand-900 text-white font-semibold text-sm hover:bg-brand-900/90 transition-colors"
        >
          Continuar →
        </button>
      </div>
    </form>
  );
}
