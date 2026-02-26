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

## Árbol de archivos — estado post-implementación

```
src/
├── middleware.ts                          ← NUEVO
├── lib/
│   ├── supabase.ts                        ← existente (no tocar)
│   ├── supabase-server.ts                 ← NUEVO
│   └── supabase-browser.ts               ← NUEVO
└── app/
    ├── admin/
    │   ├── layout.tsx                     ← NUEVO
    │   ├── page.tsx                       ← NUEVO (redirect)
    │   ├── login/
    │   │   └── page.tsx                   ← NUEVO
    │   ├── leads/
    │   │   ├── page.tsx                   ← MODIFICAR (reemplazar)
    │   │   └── LeadCard.tsx              ← NUEVO (componente client)
    │   └── onboardings/
    │       └── page.tsx                   ← NUEVO
    └── api/
        ├── leads/
        │   └── route.ts                   ← existente (no tocar)
        ├── submit/
        │   └── route.ts                   ← MODIFICAR (añadir inserts Supabase)
        └── admin/
            └── leads/
                └── [id]/
                    └── route.ts           ← NUEVO
```

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
- `src/types/onboarding.ts` — tipos `OnboardingState`, `ProductoSeleccionado`

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
  id                        UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  session_id                TEXT        UNIQUE,
  email                     TEXT        NOT NULL,
  nombre                    TEXT,
  empresa                   TEXT,
  ruc                       TEXT,
  cargo                     TEXT,
  whatsapp                  TEXT,
  pais                      TEXT,
  categoria                 TEXT,
  tagline                   TEXT,
  descripcion               TEXT,
  anos_fundacion            TEXT,
  certificaciones           TEXT,
  capacidad_mensual         TEXT,
  tiene_logo                BOOLEAN DEFAULT false,
  tiene_banner              BOOLEAN DEFAULT false,
  num_productos             INT DEFAULT 0,
  num_productos_personalizados INT DEFAULT 0,
  productos_nombres         TEXT,
  departamento              TEXT,
  provincia                 TEXT,
  distrito                  TEXT,
  duracion_seg              INT,
  etapa                     TEXT DEFAULT 'KYB_PENDIENTE'
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

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      setLoading(false);
      return;
    }
    router.push('/admin/leads');
  }

  const labelClass = "text-[10px] font-black text-brand-900/40 uppercase tracking-[0.2em] mb-1.5 block";

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 landing">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center mb-10">
            <img src="/visuals/logo.png" alt="NxinMall" className="h-10 w-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-900/40">Acceso Interno</p>
            <h1 className="text-2xl font-black text-ink mt-1">Panel Admin</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl bg-gray-50 border-none shadow-sm py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300"
                placeholder="ops@nxinmall.com"
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>Contraseña</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-gray-50 border-none shadow-sm py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white focus:shadow-md transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-brand-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-900/90 transition-all shadow-lg shadow-brand-900/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

### PASO 7 — Layout admin con nav

#### `src/app/admin/LogoutButton.tsx` (NUEVO — componente client separado)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-5 py-2.5 rounded-full bg-gray-50 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm"
    >
      Cerrar sesión
    </button>
  );
}
```

#### `src/app/admin/layout.tsx` (NUEVO)

Server component — no `'use client'`.

```typescript
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 landing">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <img src="/visuals/logo.png" alt="NxinMall" className="h-8 w-auto" />
            </Link>
            <div className="hidden sm:block h-6 w-px bg-gray-100" />
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin/leads"
                className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-brand-50 hover:text-brand-900 transition-all duration-200"
              >
                Leads
              </Link>
              <Link
                href="/admin/onboardings"
                className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-brand-50 hover:text-brand-900 transition-all duration-200"
              >
                Onboardings
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
```

#### `src/app/admin/page.tsx` (NUEVO)

```typescript
import { redirect } from 'next/navigation';
export default function AdminPage() { redirect('/admin/leads'); }
```

---

### PASO 8 — Refactorizar `/admin/leads`

#### `src/app/admin/leads/LeadCard.tsx` (NUEVO — componente client)

Maneja el `<select>` de estado y el clipboard. El server component pasa los datos, este maneja las interacciones.

```typescript
'use client';

import { useState } from 'react';
import { Briefcase, User, Globe2, Calendar, MessageCircle, Copy, Check } from 'lucide-react';
import clsx from 'clsx';

type Lead = {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
  pais: string;
  estado: string;
  created_at: string;
  onboarding_url: string | null;
};

const ESTADOS = ['nuevo', 'contactado', 'onboarding', 'descartado'] as const;

function estadoColor(estado: string) {
  switch (estado) {
    case 'onboarding':  return 'bg-emerald-500 text-white';
    case 'contactado':  return 'bg-amber-500 text-white';
    case 'descartado':  return 'bg-gray-400 text-white';
    default:            return 'bg-brand-900 text-white';
  }
}

export default function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const [estado, setEstado] = useState(lead.estado);
  const [copied, setCopied] = useState(false);

  async function handleEstadoChange(nuevoEstado: string) {
    setEstado(nuevoEstado);
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
  }

  async function handleCopyUrl() {
    if (!lead.onboarding_url) return;
    await navigator.clipboard.writeText(lead.onboarding_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const phoneClean = lead.whatsapp.replace(/[^0-9]/g, '');
  const msg = encodeURIComponent(
    `Hola ${lead.nombre}, te compartimos tu enlace de onboarding NxinMall:\n${lead.onboarding_url ?? ''}`
  );
  const waUrl = `https://wa.me/${phoneClean}?text=${msg}`;

  const labelClass = "text-[10px] font-black text-brand-900/40 uppercase tracking-[0.2em] mb-1";

  return (
    <div
      className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group reveal"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors duration-500">
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={clsx('text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full', estadoColor(estado))}>
            {estado}
          </span>
          <select
            value={estado}
            onChange={(e) => handleEstadoChange(e.target.value)}
            className="text-[9px] font-black uppercase tracking-widest bg-gray-50 border border-gray-100 rounded-full px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500/30"
          >
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="text-xl font-black text-ink leading-tight mb-1 group-hover:text-brand-900 transition-colors">{lead.empresa}</h3>
      <div className="flex items-center gap-2 text-gray-400 mb-6">
        <Globe2 className="w-3.5 h-3.5" />
        <span className="text-[10px] font-black uppercase tracking-widest">{lead.pais}</span>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink leading-none mb-1">{lead.nombre}</p>
            <p className="text-[10px] text-gray-400 font-medium">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {new Date(lead.created_at).toLocaleDateString('es-PE')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
        >
          WhatsApp <MessageCircle className="w-3 h-3" />
        </a>
        <button
          type="button"
          onClick={handleCopyUrl}
          disabled={!lead.onboarding_url}
          className="flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-brand-900 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> URL</>
          )}
        </button>
      </div>
    </div>
  );
}
```

#### `src/app/admin/leads/page.tsx` (MODIFICAR — reemplazar contenido completo)

Convertir a **Server Component** (quitar `'use client'`). Filtros client-side se mantienen en `LeadCard` y la búsqueda se puede hacer con `searchParams`.

```typescript
import { getSupabaseServer } from '@/lib/supabase-server';
import LeadCard from './LeadCard';
import { Search } from 'lucide-react';

export default async function LeadsPage() {
  const supabase = await getSupabaseServer();
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const labelClass = "text-[10px] font-black text-brand-900/40 uppercase tracking-[0.2em] mb-1.5";

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className={labelClass}>Pipeline Admin</p>
          <h1 className="text-3xl font-black text-ink">Bolsa de Leads</h1>
          <p className="text-sm text-gray-400 font-medium">{leads?.length ?? 0} leads registrados</p>
        </div>

        {/* Grid */}
        {leads && leads.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
          </section>
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 py-20 text-center shadow-sm">
            <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sin leads aún</p>
          </div>
        )}
      </div>
    </main>
  );
}
```

---

### PASO 9 — API PATCH para estado

#### `src/app/api/admin/leads/[id]/route.ts` (NUEVO)

> **Next.js 15:** `params` es una `Promise` y debe ser awaited.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ESTADOS_VALIDOS = ['nuevo', 'contactado', 'onboarding', 'descartado'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { estado } = await req.json();

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update({ estado })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

---

### PASO 10 — Modificar `/api/submit` para guardar en Supabase

#### `src/app/api/submit/route.ts` (MODIFICAR)

Añadir import al inicio:
```typescript
import { getSupabaseAdmin } from '@/lib/supabase';
```

Reemplazar el bloque completo del `try`:

```typescript
export async function POST(req: NextRequest) {
  try {
    const state: OnboardingState = await req.json();
    const storeJson = generateStoreJson(state);

    const sheetsPayload = {
      timestamp: new Date().toISOString(),
      sessionId: state.meta.sessionId,
      nombre: state.registro.nombre,
      empresa: state.registro.empresa,
      ruc: state.registro.ruc,
      email: state.registro.email,
      whatsapp: state.registro.whatsapp,
      cargo: state.registro.cargo,
      pais: state.registro.pais,
      departamento: state.ubicacion.departamento,
      provincia: state.ubicacion.provincia,
      distrito: state.ubicacion.distrito,
      categoria: state.perfil.categoria,
      tagline: state.perfil.tagline,
      certificaciones: state.perfil.certificaciones.join(', '),
      capacidadMensual: state.perfil.capacidadMensual,
      tieneLogo: !!state.perfil.logo,
      tieneBanner: !!state.perfil.banner,
      numProductos: state.catalogo.productosSeleccionados.length,
      productosNombres: state.catalogo.productosSeleccionados.map((p) => p.nombre).join(' | '),
      numImagenesSubidas: state.catalogo.productosSeleccionados.filter((p) => p.imagen?.fuente === 'upload').length,
      duracionSeg: Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000),
      fuente: 'Wizard Onboarding',
      etapa: 'KYB_PENDIENTE',
    };

    await submitToGoogleSheets(sheetsPayload);

    // Guardar onboarding completo en Supabase
    const supabase = getSupabaseAdmin();

    await supabase.from('onboardings').upsert(
      {
        session_id: state.meta.sessionId,
        email: state.registro.email,
        nombre: state.registro.nombre,
        empresa: state.registro.empresa,
        ruc: state.registro.ruc,
        cargo: state.registro.cargo,
        whatsapp: state.registro.whatsapp,
        pais: state.registro.pais,
        categoria: state.perfil.categoria,
        tagline: state.perfil.tagline,
        descripcion: state.perfil.descripcion,
        anos_fundacion: state.perfil.anosFundacion,
        certificaciones: state.perfil.certificaciones.join(', '),
        capacidad_mensual: state.perfil.capacidadMensual,
        tiene_logo: !!state.perfil.logo,
        tiene_banner: !!state.perfil.banner,
        num_productos: state.catalogo.productosSeleccionados.length,
        num_productos_personalizados: state.catalogo.productosPersonalizados.length,
        productos_nombres: state.catalogo.productosSeleccionados.map((p) => p.nombre).join(' | '),
        departamento: state.ubicacion.departamento,
        provincia: state.ubicacion.provincia,
        distrito: state.ubicacion.distrito,
        duracion_seg: Math.round((Date.now() - new Date(state.meta.startedAt).getTime()) / 1000),
        etapa: 'KYB_PENDIENTE',
      },
      { onConflict: 'session_id' }
    );

    // Automación: actualizar estado del lead a 'onboarding' si existe
    await supabase
      .from('leads')
      .update({ estado: 'onboarding' })
      .eq('email', state.registro.email);

    return NextResponse.json({ success: true, sessionId: state.meta.sessionId });
  } catch (error) {
    console.error('Error en /api/submit:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
```

---

### PASO 11 — Página de onboardings completados

#### `src/app/admin/onboardings/page.tsx` (NUEVO)

```typescript
import { getSupabaseServer } from '@/lib/supabase-server';
import clsx from 'clsx';

function etapaColor(etapa: string) {
  switch (etapa) {
    case 'APROBADO':    return 'bg-emerald-500 text-white';
    case 'RECHAZADO':   return 'bg-red-400 text-white';
    case 'EN_REVISION': return 'bg-amber-500 text-white';
    default:            return 'bg-brand-900 text-white';
  }
}

function formatDuracion(seg: number | null) {
  if (!seg) return '—';
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default async function OnboardingsPage() {
  const supabase = await getSupabaseServer();
  const { data: onboardings } = await supabase
    .from('onboardings')
    .select('id, created_at, empresa, nombre, pais, categoria, num_productos, duracion_seg, etapa, email')
    .order('created_at', { ascending: false });

  const labelClass = "text-[10px] font-black text-brand-900/40 uppercase tracking-[0.2em] mb-1.5";
  const thClass = "text-left text-[10px] font-black text-brand-900/40 uppercase tracking-[0.15em] py-3 px-4";
  const tdClass = "py-4 px-4 text-sm text-ink";

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <p className={labelClass}>Pipeline Admin</p>
          <h1 className="text-3xl font-black text-ink">Onboardings Completados</h1>
          <p className="text-sm text-gray-400 font-medium">{onboardings?.length ?? 0} onboardings registrados</p>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {onboardings && onboardings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className={thClass}>Empresa</th>
                    <th className={thClass}>Contacto</th>
                    <th className={thClass}>País</th>
                    <th className={thClass}>Categoría</th>
                    <th className={thClass}>Productos</th>
                    <th className={thClass}>Duración</th>
                    <th className={thClass}>Fecha</th>
                    <th className={thClass}>Etapa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {onboardings.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className={clsx(tdClass, 'font-bold')}>{o.empresa ?? '—'}</td>
                      <td className={tdClass}>
                        <p className="text-xs font-bold leading-none mb-1">{o.nombre ?? '—'}</p>
                        <p className="text-[10px] text-gray-400">{o.email}</p>
                      </td>
                      <td className={tdClass}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{o.pais ?? '—'}</span>
                      </td>
                      <td className={tdClass}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{o.categoria ?? '—'}</span>
                      </td>
                      <td className={clsx(tdClass, 'text-center font-bold')}>{o.num_productos ?? 0}</td>
                      <td className={clsx(tdClass, 'font-mono text-xs text-gray-500')}>{formatDuracion(o.duracion_seg)}</td>
                      <td className={clsx(tdClass, 'text-[10px] text-gray-400 font-medium whitespace-nowrap')}>
                        {new Date(o.created_at).toLocaleDateString('es-PE')}
                      </td>
                      <td className={tdClass}>
                        <span className={clsx('text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full', etapaColor(o.etapa))}>
                          {o.etapa}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aún no hay onboardings completados</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

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
4. Panel muestra leads reales de Supabase (no datos fake)
5. Cambiar estado de un lead con el `<select>` → verificar en Supabase Studio
6. Clic "WhatsApp" → abre wa.me con mensaje pre-escrito y URL
7. Clic "URL" → copia `onboarding_url` al clipboard (feedback visual "Copiado")
8. Completar wizard como proveedor → verificar fila en tabla `onboardings` + `leads.estado` = 'onboarding'
9. `/admin/onboardings` muestra el onboarding recién completado
10. Clic "Cerrar sesión" → redirige a `/admin/login`

---

## Gotchas

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` es distinta a `SUPABASE_SERVICE_ROLE_KEY`. La anon key es pública (puede ir en `NEXT_PUBLIC_`). La service_role **NUNCA**.
- El middleware usa la anon key, no la service_role — correcto por diseño (solo verifica sesión).
- `getSupabaseServer()` es async porque `cookies()` en Next.js 15+ es async.
- El `layout.tsx` de admin NO debe tener `'use client'` — el botón de logout es un componente separado con `'use client'`.
- En Next.js 15, `params` en route handlers es una `Promise` — usar `const { id } = await params`.
- Tailwind v4: no usar `tailwind.config.ts`. Los colores `brand-*` ya están definidos en `src/app/globals.css`.
- El UPDATE de `leads.estado` en `/api/submit` no falla si no hay lead con ese email (proveedor nuevo que llegó directo al wizard sin pasar por landing). El `.update()` sin resultados simplemente no hace nada.
- `LeadCard.tsx` vive en `src/app/admin/leads/` (no en `src/components/`) — es un Server Component boundary local, no un componente reutilizable.
