import { z } from 'zod';

type SchemaLang = 'en' | 'es' | 'pt';

function msg(lang: SchemaLang) {
  if (lang === 'es') {
    return {
      fullNameMin: 'El nombre debe tener al menos 2 caracteres',
      companyRequired: 'El nombre de la empresa es requerido',
      taxIdPeru: 'El RUC debe tener 11 dígitos',
      taxIdBrazil: 'El CNPJ debe tener 14 dígitos',
      taxIdBrazilCpf: 'El CPF debe tener 11 dígitos',
      invalidEmail: 'Email inválido',
      whatsappRequired: 'WhatsApp requerido',
      roleRequired: 'Escribe tu cargo',
      roleMax: 'El cargo debe tener máximo 50 caracteres',
      countryRequired: 'País requerido',
      documentTypeRequired: 'Selecciona el tipo de documento',
    };
  }
  if (lang === 'pt') {
    return {
      fullNameMin: 'O nome deve ter pelo menos 2 caracteres',
      companyRequired: 'O nome da empresa é obrigatório',
      taxIdPeru: 'O RUC deve ter 11 dígitos',
      taxIdBrazil: 'O CNPJ deve ter 14 dígitos',
      taxIdBrazilCpf: 'O CPF deve ter 11 dígitos',
      invalidEmail: 'E-mail inválido',
      whatsappRequired: 'WhatsApp é obrigatório',
      roleRequired: 'Escreva seu cargo',
      roleMax: 'O cargo deve ter no máximo 50 caracteres',
      countryRequired: 'País é obrigatório',
      documentTypeRequired: 'Selecione o tipo de documento',
    };
  }
  return {
    fullNameMin: 'Full name must have at least 2 characters',
    companyRequired: 'Company name is required',
    taxIdPeru: 'Peru RUC must have 11 digits',
    taxIdBrazil: 'Brazil CNPJ must have 14 digits',
    taxIdBrazilCpf: 'Brazil CPF must have 11 digits',
    invalidEmail: 'Invalid email',
    whatsappRequired: 'WhatsApp is required',
    roleRequired: 'Job title is required',
    roleMax: 'Job title must have at most 50 characters',
    countryRequired: 'Country is required',
    documentTypeRequired: 'Select a document type',
  };
}

export function createStep1Schema(lang: SchemaLang) {
  const m = msg(lang);
  return z.object({
    nombre: z.string().min(2, m.fullNameMin),
    empresa: z.string().min(2, m.companyRequired),
    ruc: z.string().optional(),
    documentPersonType: z.enum(['individual', 'company', '']).optional(),
    documentType: z.enum(['cpf', 'cnpj', 'ruc', 'tax_id', '']).optional(),
    documentNumber: z.string().optional(),
    documentDeferred: z.boolean().optional(),
    email: z.string().email(m.invalidEmail),
    whatsapp: z.string().min(7, m.whatsappRequired),
    cargo: z.string().min(1, m.roleRequired).max(50, m.roleMax),
    pais: z.string().min(1, m.countryRequired),
  }).superRefine((data, ctx) => {
    const deferred = Boolean(data.documentDeferred);
    const chosenDocument = String(data.documentType ?? '').trim();
    const raw = String(data.documentNumber ?? data.ruc ?? '').trim();
    if (!deferred && !raw && data.pais === 'Brasil' && !chosenDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documentType'],
        message: m.documentTypeRequired,
      });
      return;
    }
    if (!raw) return;
    const digits = raw.replace(/\D/g, '');
    if (data.pais === 'Brasil' && chosenDocument === 'cpf' && digits.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documentNumber'],
        message: m.taxIdBrazilCpf,
      });
      return;
    }
    if (data.pais === 'Brasil' && chosenDocument !== 'cpf' && digits.length !== 14) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documentNumber'],
        message: m.taxIdBrazil,
      });
      return;
    }
    if (data.pais === 'Peru' && digits.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['documentNumber'],
        message: m.taxIdPeru,
      });
    }
  });
}

export const step1Schema = createStep1Schema('en');

export const step2Schema = z.object({
  categoria: z.enum(['frutas', 'flores', 'viveros', 'empacadoras', 'plasticos', 'insumos']),
  tagline: z.string().min(10, 'Tagline must have at least 10 characters').max(120, 'Maximum 120 characters'),
  descripcion: z.string().min(20, 'Description must have at least 20 characters').max(400, 'Maximum 400 characters'),
  anosFundacion: z.string().min(1, 'Founding year is required'),
  capacidadMensual: z.string().min(1, 'Monthly capacity is required'),
  certificaciones: z.array(z.string()),
  logo: z.any().nullable(),
  banner: z.any().nullable(),
});

export const step3Schema = z.object({
  departamento: z.string().min(1, 'Select a department/state'),
  provincia: z.string().min(1, 'Select a province/city'),
  distrito: z.string().min(1, 'Select a district'),
  direccion: z.string().min(5, 'Address is required'),
  referencia: z.string().optional(),
  codigoPostal: z.string().optional(),
});

export const step4Schema = z.object({
  productosSeleccionados: z.array(z.any()).min(1, 'Select at least one product'),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
