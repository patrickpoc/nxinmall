const SHEETS_WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || '';

export interface SheetsPayload {
  timestamp: string;
  sessionId: string;
  nombre: string;
  empresa: string;
  ruc: string;
  email: string;
  whatsapp: string;
  cargo: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  categoria: string;
  tagline: string;
  certificaciones: string;
  capacidadMensual: string;
  tieneLogo: boolean;
  tieneBanner: boolean;
  numProductos: number;
  productosNombres: string;
  numImagenesSubidas: number;
  duracionSeg: number;
  fuente: string;
  etapa: string;
}

export async function submitToGoogleSheets(payload: SheetsPayload): Promise<void> {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn('SHEETS_WEBHOOK_URL no configurado — omitiendo envío a Google Sheets');
    return;
  }

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error enviando a Google Sheets:', error);
  }
}
