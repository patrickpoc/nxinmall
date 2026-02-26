import { z } from 'zod';

export const step1Schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().min(2, 'El nombre de la empresa es requerido'),
  ruc: z.string().optional().refine(
    val => !val || /^\d{11}$/.test(val),
    'El RUC debe tener 11 dígitos'
  ),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(7, 'WhatsApp requerido'),
  cargo: z.string().min(1, 'Selecciona tu cargo'),
  pais: z.string().min(1, 'País requerido'),
});

export const step2Schema = z.object({
  categoria: z.enum(['frutas', 'flores', 'viveros', 'empacadoras', 'plasticos', 'insumos']),
  tagline: z.string().min(10, 'El tagline debe tener al menos 10 caracteres').max(120, 'Máximo 120 caracteres'),
  descripcion: z.string().min(20, 'La descripción debe tener al menos 20 caracteres').max(400, 'Máximo 400 caracteres'),
  anosFundacion: z.string().min(1, 'Año de fundación requerido'),
  capacidadMensual: z.string().min(1, 'Capacidad mensual requerida'),
  certificaciones: z.array(z.string()),
  logo: z.any().nullable(),
  banner: z.any().nullable(),
});

export const step3Schema = z.object({
  departamento: z.string().min(1, 'Selecciona un departamento'),
  provincia: z.string().min(1, 'Selecciona una provincia'),
  distrito: z.string().min(1, 'Selecciona un distrito'),
  direccion: z.string().min(5, 'La dirección es requerida'),
  referencia: z.string().optional(),
  codigoPostal: z.string().optional(),
});

export const step4Schema = z.object({
  productosSeleccionados: z.array(z.any()).min(1, 'Selecciona al menos un producto'),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
