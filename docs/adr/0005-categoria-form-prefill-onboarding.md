# ADR-0005: Categoría de Producto en el Formulario + Pre-fill del Onboarding

- **Estado:** Implementado (pendiente SQL en Supabase)
- **Fecha:** 2026-02-27
- **Autores:** Diego + Claude Sonnet 4.6

---

## Contexto

El formulario de la landing (`/`) no pedía ninguna categoría de producto, lo que implicaba que el equipo de operaciones no sabía qué tipo de proveedor era el lead antes de contactarlo. Adicionalmente, el onboarding empezaba siempre desde cero — si el proveedor ya había indicado su rubro en el form, debía elegirlo nuevamente en el Step 2.

La plataforma NXIN tiene 8 categorías fijas. Internamente tenemos categorías adicionales (frutas, flores, viveros, insumos) que son nuevas para la plataforma (marcadas como `esNueva: true` en el catálogo).

---

## Decisión

### 1. Lista unificada de categorías (`src/data/categories.ts`)

Se define `CATEGORIAS_FORM` con 11 categorías en 3 idiomas (es/en/pt), combinando las 8 de NXIN con las nuestras adicionales:

| ID form       | Nombre ES                 | Origen         |
|---------------|---------------------------|----------------|
| `frutas`      | Frutas y Verduras          | Interna        |
| `flores`      | Flores de Exportación      | Interna        |
| `viveros`     | Viveros y Plantas          | Interna        |
| `envase`      | Envase y Embalaje          | NXIN plataforma|
| `siembra`     | Siembra y Riego            | NXIN plataforma|
| `insumos`     | Insumos y Agroquímicos     | Interna        |
| `cosecha`     | Cosecha                    | NXIN plataforma|
| `plantin`     | Plantines                  | NXIN plataforma|
| `accesorios`  | Accesorios para Frutas     | NXIN plataforma|
| `exhibicion`  | Exhibición                 | NXIN plataforma|
| `dispositivo` | Dispositivos Inteligentes  | NXIN plataforma|
| `otros`       | Otros                      | NXIN plataforma|

### 2. Mapa form → categoría interna del wizard (`CATEGORIA_FORM_MAP`)

Seis de las 11 categorías del form tienen un match directo con las tarjetas visuales del Step 2 del onboarding:

| ID form       | Categoría interna wizard |
|---------------|--------------------------|
| `frutas`      | `frutas`                 |
| `flores`      | `flores`                 |
| `viveros`     | `viveros`                |
| `plantin`     | `viveros`                |
| `envase`      | `empacadoras`            |
| `siembra`     | `plasticos`              |
| `insumos`     | `insumos`                |

Las restantes (`cosecha`, `accesorios`, `exhibicion`, `dispositivo`, `otros`) no tienen match. El wizard queda sin categoría pre-seleccionada y el proveedor elige libremente en Step 2.

### 3. Flujo de datos

```
Form landing → POST /api/leads (guarda categoria)
  → Supabase leads.categoria
  → Google Sheets columna "Categoria"

Ops envía link → GET /api/onboarding-invite/[token]
  → devuelve { ..., categoria }

Onboarding carga → initSession(token, { ...rest, categoriaInteres: categoria })
  → perfil.categoria = CATEGORIA_FORM_MAP[categoriaInteres] || ''
  → Step 2 muestra la tarjeta pre-seleccionada si hay match
```

### 4. Página `/gracias`

Se convirtió a `'use client'` para leer el idioma del store. Ahora muestra:
- Logo real (`/visuals/logo.png`) en lugar de texto hardcodeado
- Título y texto en el idioma del proveedor (ES o PT)
- Nombre del proveedor si está disponible en el store

---

## Pendientes

### DB — Supabase

- [ ] **Agregar columna `categoria`** a la tabla `leads` ← **pendiente ejecutar en Supabase**

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS categoria text;
```

Sin esta columna el valor se pierde silenciosamente (el código ya la envía pero Supabase la ignora). Google Sheets sí la captura desde ya.

### Admin Panel

- [x] **Mostrar `categoria` en `LeadsTable`** — columna badge entre "País" y "Estado". Traducción en `admin-content.ts` (es/en/pt). Select query actualizada en `page.tsx`.

### Catálogo — Categorías sin cobertura

Las 5 categorías NXIN que no tienen match interno (`cosecha`, `accesorios`, `exhibicion`, `dispositivo`, `otros`) tampoco tienen productos en el catálogo del wizard (Step 4). Si un proveedor de dispositivos o herramientas de cosecha llega al onboarding, no encontrará productos relevantes.

- [ ] **Decidir**: ¿crear archivos de catálogo para estas categorías? ¿o redirigirlos a un formulario libre?
- [ ] Si se crean catálogos: agregar los IDs al tipo `Categoria` en `src/types/onboarding.ts`, crear archivos en `src/data/catalog/`, registrar en `src/data/catalog.ts`, y agregar tarjetas visuales en Step 2.

### Google Sheets — Webhook

- [x] **Apps Script** actualizado — `CATEGORIA` agregada como columna 6 en `handleLandingLead` (headers + appendRow). Redeploy necesario en Google Apps Script.

### UX — Step 2 con categoría sin match

- [x] **Banner suave en Step 2** — si `categoriaInteres` no tiene match en `CATEGORIA_FORM_MAP`, se muestra un aviso amber antes de la grilla: *"Seleccionaste "[X]" — por ahora elige la categoría más cercana"* (es/pt). Archivo: `Step2Perfil.tsx`.

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/data/categories.ts` *(nuevo)* | Lista unificada `CATEGORIAS_FORM` + `CATEGORIA_FORM_MAP` |
| `src/types/onboarding.ts` | `registro.categoriaInteres?: string` |
| `src/data/landing-content.ts` | Labels `categoria` y `categoriaPlaceholder` en es/en/pt |
| `src/components/landing/ContactAndFaq.tsx` | `<select>` de categoría en el form |
| `src/app/api/leads/route.ts` | Extrae y guarda `categoria` en DB + Sheets |
| `src/app/api/onboarding-invite/[token]/route.ts` | Devuelve `categoria` en el GET |
| `src/app/onboarding/page.tsx` | Mapea `categoria` → `categoriaInteres` antes de `initSession` |
| `src/lib/store.ts` | `initSession` pre-rellena `perfil.categoria` via `CATEGORIA_FORM_MAP` |
| `src/app/gracias/page.tsx` | Logo real, idioma dinámico, nombre del proveedor |
| `src/lib/i18n.ts` | Keys `graciasTitle/Subtitle/Horas/Volver` en ES y PT |
