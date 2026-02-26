# ADR-0002: Pipeline de Leads con Supabase

- **Estado:** Aceptado
- **Fecha:** 2026-02-26
- **Autores:** Diego + Claude Sonnet 4.6

---

## Contexto

Con el wizard de onboarding listo (ADR-0001), el siguiente cuello de botella era la captación de leads desde la landing. El formulario de contacto enviaba un `mailto:` — sin persistencia, sin trazabilidad, sin forma de que ops pudiera darle seguimiento estructurado.

El objetivo: capturar leads en una base de datos real, y generar una URL pre-rellena para que ops pueda enviar al proveedor directo al Step 1 del wizard con sus datos ya cargados.

---

## Decisión

Se adoptó **Supabase** como backend de leads, con una tabla `leads` simple. El flujo completo es:

```
Landing form (5 campos)
  → POST /api/leads
    → INSERT en Supabase tabla leads (con onboarding_url generada)
    → POST Google Sheets webhook (notificación al equipo comercial)
  → Mensaje de éxito inline (sin reload)
```

Ops abre Supabase Studio → ve la fila → copia `onboarding_url` → la envía por WhatsApp al proveedor → proveedor abre el wizard con Step 1 pre-rellenado.

---

## Alternativas Consideradas

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| Mantener `mailto:` | Sin persistencia ni trazabilidad |
| Firebase Firestore | Más complejo, sin SQL, vendor lock distinto |
| PlanetScale / Turso | Sin dashboard visual listo para ops no-técnicos |
| Neon + Drizzle | Más setup, sin Studio integrado |
| **Supabase** ✓ | Postgres real, Studio visual, Row Level Security, MCP disponible para agentes |

---

## Cambios Implementados

### 1. `src/data/landing-content.ts`
Eliminados `message` y `messagePlaceholder` de los 3 idiomas (`es`, `en`, `pt`). El formulario quedó en 5 campos: nombre, empresa, email, whatsapp, país.

### 2. `src/components/landing/ContactAndFaq.tsx`
- Eliminado el `<textarea>` de mensaje
- Añadida prop `submitted: boolean`
- Cuando `submitted === true` → el `<form>` se reemplaza por un mensaje de éxito inline (sin reload de página)

### 3. `src/app/page.tsx`
- `handleSubmit` cambiado de `window.location.href = mailto:...` a `fetch('/api/leads', ...)`
- Añadido estado `const [submitted, setSubmitted] = useState(false)`
- Pasado `submitted` a `<ContactForm>`

### 4. `src/lib/supabase.ts` (nuevo)
Cliente admin con inicialización lazy (función, no exportación directa del cliente) para evitar error `supabaseUrl is required` durante `next build`:

```typescript
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

### 5. `src/app/api/leads/route.ts` (nuevo)
`POST /api/leads` — Body: `{ nombre, empresa, email, whatsapp, pais }`
1. Construye `onboarding_url` = `/onboarding?nombre=X&empresa=Y&...`
2. Inserta fila en tabla `leads` via `getSupabaseAdmin()`
3. Llama `submitToGoogleSheets` con `fuente: 'Landing Lead'` (routing al webhook ya existente)
4. Retorna `{ success: true }`

### 6. `src/app/onboarding/page.tsx`
Extendido el pre-fill de 3 a 5 params: añadidos `whatsapp` y `pais`. El store ya auto-setea `idioma` según `pais` (Brasil → `'pt'`) sin cambios adicionales.

---

## Esquema de la Tabla `leads`

```sql
CREATE TABLE leads (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  nombre        TEXT        NOT NULL,
  empresa       TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  whatsapp      TEXT        NOT NULL,
  pais          TEXT        NOT NULL,
  estado        TEXT        DEFAULT 'nuevo'
                CHECK (estado IN ('nuevo', 'contactado', 'onboarding', 'descartado')),
  onboarding_url TEXT
);
```

---

## Configuración Recomendada de Supabase para Esta Plataforma

### Seguridad
```sql
-- Habilitar RLS (el service_role lo bypassa, pero es defensa en profundidad)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Sin policies públicas = nadie puede leer/escribir excepto service_role
```

### Performance
```sql
-- Queries frecuentes de ops: filtrar por estado y ordenar por fecha
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX leads_estado_idx ON leads (estado);
CREATE INDEX leads_email_idx ON leads (email);
```

### Connection Pooler
- Modo: **Transaction** (PgBouncer) — obligatorio para Next.js en Vercel (funciones serverless crean conexiones efímeras)
- En Supabase Dashboard → Settings → Database → Connection Pooling → Mode: Transaction
- Usar la **Pooler connection string** en Vercel, no la directa

### Realtime
- **Deshabilitado** para `leads` — no se necesita en este flujo (ops usa Studio como dashboard)
- Si en el futuro se quiere un panel en tiempo real para el equipo, habilitar con `supabase.channel()`

### Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL=https://jtmpctetdefkiqyedszl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>   ← nunca NEXT_PUBLIC_
```

Nota: `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe tener el prefijo `NEXT_PUBLIC_` — expone acceso total a la DB desde el browser.

---

## MCP de Supabase para Agentes

Configurado en `~/.claude/settings.json` apuntando al proyecto `jtmpctetdefkiqyedszl`. Permite que agentes futuros ejecuten SQL, inspeccionen tablas y validen datos sin salir del flujo de trabajo.

---

## Dependencia Instalada

```
@supabase/supabase-js  ^2.x
```

---

## Flujo Ops Completo

1. Lead llena el form en landing (5 campos) → `POST /api/leads`
2. Fila creada en Supabase con `estado = 'nuevo'` + notificación en Google Sheets
3. Ops ve la fila en Supabase Studio → copia `onboarding_url` → envía al proveedor por WhatsApp
4. Proveedor abre la URL → Step 1 pre-rellenado con sus 5 datos → completa el wizard normalmente
5. Al finalizar el wizard → JSON descargado + datos enviados a Sheets (flujo ADR-0001, sin cambios)

---

## Implementación en Producción

Ejecutada el 2026-02-26. Resumen de lo aplicado:

### Migración SQL ejecutada (via MCP Supabase)

Tabla `leads` creada en el proyecto `jtmpctetdefkiqyedszl` con las siguientes diferencias respecto al esquema original:

- `email` tiene constraint `UNIQUE` — requisito para la deduplicación via `upsert`
- Índices creados: `leads_created_at_idx`, `leads_estado_idx`, `leads_email_idx`
- RLS habilitado (`ALTER TABLE leads ENABLE ROW LEVEL SECURITY`)

### Variables de entorno configuradas

`.env.local` creado en raíz del proyecto. Las mismas 3 vars deben agregarse en Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://jtmpctetdefkiqyedszl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
NEXT_PUBLIC_APP_URL=https://nxin-onboarding.vercel.app
```

---

## Deuda Técnica

| # | Problema | Estado | Solución aplicada |
|---|----------|--------|-------------------|
| 1 | `onboarding_url` relativa — ops no podía enviarla por WhatsApp | ✅ Resuelto | `baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''` en `route.ts` |
| 2 | Sin deduplicación — mismo email podía crear múltiples filas | ✅ Resuelto | `insert` → `upsert({ onConflict: 'email' })` + UNIQUE constraint en la tabla |
| 3 | `estado` se actualiza manualmente en Supabase Studio | Pendiente | Panel ops interno o trigger al completar wizard |
