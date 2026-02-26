# Handoff — Panel Admin CRM con Auth

## Objetivo

Construir un panel CRM interno para el equipo ops de NxinMall dentro del proyecto Next.js existente. El panel vive en `/admin/*`, tiene login con Supabase Auth, muestra leads reales desde Supabase, permite cambiar estados, enviar WhatsApp, y ver onboardings completados.

---

## Proyecto

- **Path:** `/Users/diego/Desktop/DataSet/nxin-onboarding`
- **Stack:** Next.js 16 (App Router) + Tailwind v4 + TypeScript + Supabase
- **Supabase proyecto:** `jtmpctetdefkiqyedszl`
- **MCP Supabase:** configurado en `~/.claude/settings.json` — úsalo para ejecutar SQL
- **Convenciones:**
  - Español (Perú) en toda la UI
  - `'use client'` en todos los componentes interactivos
  - Tailwind v4: sin `tailwind.config.ts` — colores en `src/app/globals.css` bajo `@theme {}`
  - Colores: `brand-900: #0a63d6`, `brand-700: #108fff`, `success: #5fbf7a`
  - **NO ejecutar `npm run build`** — solo sugerir al usuario que lo haga

---

## Estado actual del código

### Lo que YA existe (no tocar salvo lo indicado)

| Ruta | Archivo | Estado |
|------|---------|--------|
| `/` | `src/app/page.tsx` | ✅ Landing con form de leads |
| `/onboarding` | `src/app/onboarding/page.tsx` | ✅ Wizard 5 pasos |
| `/gracias` | `src/app/gracias/page.tsx` | ✅ Thank you page |
| `/admin/leads` | `src/app/admin/leads/page.tsx` | ⚠️ UI lista pero datos FALSOS hardcodeados, sin auth |
| `POST /api/leads` | `src/app/api/leads/route.ts` | ✅ Crea lead en Supabase |
| `POST /api/submit` | `src/app/api/submit/route.ts` | ⚠️ Solo guarda en Google Sheets, NO en Supabase |

### Archivos lib clave

- `src/lib/supabase.ts` — `getSupabaseAdmin()` — cliente admin con service_role (server-only)
- `src/lib/store.ts` — Zustand store del wizard
- `src/lib/sheets.ts` — webhook Google Sheets

### Variables de entorno disponibles (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://jtmpctetdefkiqyedszl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bXBjdGV0ZGVma2lxeWVkc3psIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEzOTY4OCwiZXhwIjoyMDg3NzE1Njg4fQ.wWroRlxLjv5EGlJKIZZwQAEXbSuhOTO1F9BxEJupFJQ
NEXT_PUBLIC_APP_URL=https://nxin-onboarding.vercel.app
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
```

### Base de datos existente

Tabla `leads` ya creada con estos campos:
```
id, created_at, nombre, empresa, email (UNIQUE), whatsapp, pais, estado, onboarding_url
```
`estado` tiene CHECK constraint: `('nuevo', 'contactado', 'onboarding', 'descartado')`

---

## Tareas a implementar (en orden)

### PASO 1 — Instalar dependencia

```bash
npm install @supabase/ssr
```

Necesario para manejar cookies de sesión de Supabase Auth en Next.js App Router.

---

### PASO 2 — Crear tabla `onboardings` en Supabase (via MCP)

```sql
CREATE TABLE onboardings (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  session_id       TEXT,
  email            TEXT        NOT NULL,
  nombre           TEXT,
  empresa          TEXT,
  ruc              TEXT,
  whatsapp         TEXT,
  pais             TEXT,
  categoria        TEXT,
  tagline          TEXT,
  certificaciones  TEXT,
  capacidad_mensual TEXT,
  tiene_logo       BOOLEAN DEFAULT false,
  tiene_banner     BOOLEAN DEFAULT false,
  num_productos    INT DEFAULT 0,
  productos_nombres TEXT,
  departamento     TEXT,
  provincia        TEXT,
  distrito         TEXT,
  duracion_seg     INT,
  etapa            TEXT DEFAULT 'KYB_PENDIENTE'
);

ALTER TABLE onboardings ENABLE ROW LEVEL SECURITY;
CREATE INDEX onboardings_created_at_idx ON onboardings (created_at DESC);
CREATE INDEX onboardings_email_idx ON onboardings (email);
```

---

### PASO 3 — Habilitar Supabase Auth (instrucciones para el usuario)

Después de escribir el código, indicar al usuario que haga esto manualmente:
1. Supabase Dashboard → Authentication → Providers → habilitar "Email"
2. Authentication → Users → "Invite user" → ingresar emails del equipo ops
3. Cada usuario recibirá email para setear contraseña

---

### PASO 4 — Crear clientes Supabase para auth

#### `src/lib/supabase-server.ts` (NUEVO)
Cliente server-side que lee cookies — para middleware y Server Components:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

#### `src/lib/supabase-browser.ts` (NUEVO)
Cliente browser-side para login/logout desde componentes client:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**IMPORTANTE:** Estas funciones usan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no la service_role). Agregar esta var al `.env.local` — se obtiene en Supabase Dashboard → Project Settings → API → `anon public`.

---

### PASO 5 — Middleware de protección de rutas

#### `src/middleware.ts` (NUEVO)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (user && request.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/leads', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

### PASO 6 — Página de login

#### `src/app/admin/login/page.tsx` (NUEVO)

Componente `'use client'`. Usa `getSupabaseBrowser()`. Form con email + password. Al hacer submit → `supabase.auth.signInWithPassword({ email, password })` → si ok → `router.push('/admin/leads')`. Si error → mostrar mensaje "Credenciales incorrectas".

Diseño: centrado, logo NxinMall arriba, card con el form, mismos estilos rounded-[32px] / brand-900 del resto del proyecto.

---

### PASO 7 — Layout admin con nav

#### `src/app/admin/layout.tsx` (NUEVO)

Server component. Tiene header sticky con:
- Logo NxinMall (link a `/`)
- Nav links: "Leads" → `/admin/leads`, "Onboardings" → `/admin/onboardings`
- Botón "Cerrar sesión" (client component separado que llama `supabase.auth.signOut()` y hace `router.push('/admin/login')`)

#### `src/app/admin/page.tsx` (NUEVO)
```typescript
import { redirect } from 'next/navigation';
export default function AdminPage() { redirect('/admin/leads'); }
```

---

### PASO 8 — Refactorizar `/admin/leads`

#### `src/app/admin/leads/page.tsx` (MODIFICAR — reemplazar contenido casi completo)

Convertir a **Server Component** (quitar `'use client'`). Los filtros y acciones inline serán componentes client separados.

**Fetch real desde Supabase:**
```typescript
const supabase = await getSupabaseServer();
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false });
```

**Cambios en las tarjetas:**
1. Reemplazar botón "Enviar" (mailto) por botón "WhatsApp":
   ```typescript
   // Limpiar número: quitar +, espacios, guiones
   const phoneClean = lead.whatsapp.replace(/[^0-9]/g, '');
   const msg = encodeURIComponent(`Hola ${lead.nombre}, te compartimos tu enlace de onboarding NxinMall:\n${lead.onboarding_url}`);
   const waUrl = `https://wa.me/${phoneClean}?text=${msg}`;
   ```

2. Reemplazar badge de estado por `<select>` con los 4 estados. Al cambiar → fetch `PATCH /api/admin/leads/[id]` con el nuevo estado. Sin reload. Colores de estado:
   - `nuevo` → `bg-brand-900`
   - `contactado` → `bg-amber-500`
   - `onboarding` → `bg-emerald-500`
   - `descartado` → `bg-gray-400`

3. Botón "Onboarding": en lugar de link a `/onboarding?invite=id` (fake), hacer botón "Copiar URL" que copia `lead.onboarding_url` al clipboard.

**Nota sobre filtros:** Los filtros (país, búsqueda) pueden mantenerse como client-side sobre los datos ya cargados — el dataset de leads es pequeño.

---

### PASO 9 — API PATCH para estado

#### `src/app/api/admin/leads/[id]/route.ts` (NUEVO)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { estado } = await req.json();
  const estados = ['nuevo', 'contactado', 'onboarding', 'descartado'];
  if (!estados.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }
  await getSupabaseAdmin().from('leads').update({ estado }).eq('id', params.id);
  return NextResponse.json({ success: true });
}
```

---

### PASO 10 — Modificar `/api/submit` para guardar en Supabase

#### `src/app/api/submit/route.ts` (MODIFICAR — añadir al final del try block, antes del return)

Después de `await submitToGoogleSheets(sheetsPayload)`, añadir:

```typescript
// Guardar onboarding completo en Supabase
await getSupabaseAdmin().from('onboardings').insert({
  session_id: state.meta.sessionId,
  email: state.registro.email,
  nombre: state.registro.nombre,
  empresa: state.registro.empresa,
  ruc: state.registro.ruc,
  whatsapp: state.registro.whatsapp,
  pais: state.registro.pais,
  categoria: state.perfil.categoria,
  tagline: state.perfil.tagline,
  certificaciones: state.perfil.certificaciones.join(', '),
  capacidad_mensual: state.perfil.capacidadMensual,
  tiene_logo: !!state.perfil.logo,
  tiene_banner: !!state.perfil.banner,
  num_productos: state.catalogo.productosSeleccionados.length,
  productos_nombres: state.catalogo.productosSeleccionados.map((p) => p.nombre).join(' | '),
  departamento: state.ubicacion.departamento,
  provincia: state.ubicacion.provincia,
  distrito: state.ubicacion.distrito,
  duracion_seg: Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000),
  etapa: 'KYB_PENDIENTE',
});

// Automación: actualizar estado del lead a 'onboarding'
await getSupabaseAdmin()
  .from('leads')
  .update({ estado: 'onboarding' })
  .eq('email', state.registro.email);
```

Añadir import: `import { getSupabaseAdmin } from '@/lib/supabase';`

---

### PASO 11 — Página de onboardings completados

#### `src/app/admin/onboardings/page.tsx` (NUEVO)

Server component. Fetch desde tabla `onboardings` ordenado por `created_at DESC`. Mostrar en tabla o grid:
- empresa, nombre, pais, categoria, num_productos, duracion_seg, created_at
- Badge con `etapa`

Mismo estilo visual que `/admin/leads`.

---

### PASO 12 — Variable de entorno faltante

Añadir a `.env.local`:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key del proyecto>
```

La anon key se obtiene en: Supabase Dashboard → Project Settings → API → `anon public`.

Instrucciones para el usuario al final:
- Añadir `NEXT_PUBLIC_SUPABASE_ANON_KEY` también en Vercel → Environment Variables → redeploy

---

## Flujo completo post-implementación

```
Lead llena form landing
  → POST /api/leads → Supabase tabla leads (estado='nuevo')
  → Ops ve lead en /admin/leads
  → Ops hace clic en "WhatsApp" → mensaje pre-escrito con onboarding_url
  → Proveedor completa wizard
  → POST /api/submit → INSERT tabla onboardings + UPDATE leads.estado='onboarding' (automático)
  → Ops ve onboarding en /admin/onboardings
```

---

## Verificación final (sugerir al usuario)

1. `npm run build` — debe pasar sin errores TS
2. Abrir `/admin/leads` sin sesión → redirige a `/admin/login`
3. Login con usuario ops → entra al panel
4. Panel muestra leads reales (no fake)
5. Cambiar estado de un lead → verificar en Supabase Studio
6. Clic "WhatsApp" → abre wa.me con mensaje pre-escrito
7. Completar wizard como proveedor → verificar fila en tabla `onboardings` + `leads.estado` = 'onboarding'
8. `/admin/onboardings` muestra el onboarding recién completado

---

## Gotchas

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` es distinta a `SUPABASE_SERVICE_ROLE_KEY`. La anon key es pública (puede ir en `NEXT_PUBLIC_`). La service_role NUNCA.
- El middleware usa la anon key, no la service_role — correcto por diseño (solo verifica sesión).
- `getSupabaseServer()` es async porque `cookies()` en Next.js 15+ es async.
- El `layout.tsx` de admin NO debe tener `'use client'` — el botón de logout debe ser un componente separado con `'use client'`.
- Tailwind v4: no usar `tailwind.config.ts`. Los colores `brand-*` ya están definidos en `src/app/globals.css`.
