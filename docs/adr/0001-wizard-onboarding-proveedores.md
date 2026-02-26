# ADR-0001: Wizard de Captación y Onboarding de Proveedores NxinMall Peru

- **Estado:** Aceptado
- **Fecha:** 2026-02-26
- **Autores:** Diego + Claude Sonnet 4.6

---

## Contexto

NxinMall es una plataforma B2B de agroindustria desarrollada por un equipo técnico chino. El problema operativo era doble:

1. **Captación:** El equipo comercial peruano no tenía un flujo estructurado para registrar y calificar mayoristas/exportadores interesados.
2. **Activación:** No existía un mecanismo para recolectar toda la información necesaria (perfil, ubicación, catálogo, imágenes) que el equipo chino necesita para subir la tienda del proveedor a la plataforma.

El proceso anterior era manual: llamada → email → adjuntos dispersos → carga manual sin estándar.

---

## Decisión

Se construyó un **pipeline de ventas con wizard de onboarding de 5 pasos** como aplicación web independiente. El flujo captura todos los datos del proveedor y los empaqueta en:

- Un **JSON de configuración de tienda** descargable (para el equipo chino)
- Una **fila en Google Sheets** con datos resumidos (para el equipo comercial peruano)

### El patrón "Wizard of Oz"

El proveedor experimenta el flujo como si su tienda se estuviera configurando automáticamente. La pantalla final dice: *"Tu perfil fue enviado — te contactamos en 24h"*. En realidad, el equipo toma el JSON manualmente y sube la tienda. Este patrón fue elegido deliberadamente para:

- No requerir integración directa con la plataforma china (que no expone API pública)
- Dar sensación de automatización antes de que exista la infraestructura real
- Permitir validación humana (KYB) antes de activar tiendas

---

## Estructura del Proyecto

```
/
├── src/app/
│   ├── page.tsx              ← Landing (migrada del index.html existente)
│   ├── onboarding/page.tsx   ← Wizard pasos 1–5 (un único page, step en Zustand)
│   ├── gracias/page.tsx      ← Pantalla final Wizard of Oz
│   └── api/submit/route.ts   ← POST: Sheets + retorna confirmación
├── src/components/wizard/
│   ├── WizardShell.tsx       ← Layout: header sticky + progress bar + nav
│   ├── WizardProgress.tsx    ← Barra de 5 segmentos con labels
│   └── steps/Step[1-5].tsx  ← Un componente por paso, autocontenido
├── src/components/ui/        ← CategoryCard, ProductRow, ImageUploadBox, PhoneInput
├── src/data/
│   ├── catalog.ts            ← 6 categorías × 15 productos (precios y MOQ de referencia)
│   └── peru-ubigeo.ts        ← Ubigeo INEI: 25 dep / ~200 prov / ~500 dist
├── src/lib/
│   ├── store.ts              ← Zustand + persist localStorage (key: nxin_onboarding)
│   ├── generate-json.ts      ← Construye StoreConfig + descarga como .json
│   ├── sheets.ts             ← POST al Google Apps Script webhook
│   ├── schemas.ts            ← Validaciones Zod por paso
│   └── utils.ts              ← slugify, generateId, fileToDataUrl
└── src/types/onboarding.ts   ← OnboardingState, StoreConfig, ProductoSeleccionado
```

---

## Los 5 Pasos del Wizard

| Paso | Nombre | Propósito | Validación clave |
|------|--------|-----------|-----------------|
| 1 | Registro | Datos de contacto del proveedor | Email válido, cargo, país |
| 2 | Perfil | Categoría + descripción + logo/banner | Categoría seleccionada, tagline ≥10 chars |
| 3 | Ubicación | Dep/Prov/Dist Peru + dirección | Los 3 selects encadenados + dirección |
| 4 | Catálogo | Selección de productos con MOQ y precio | ≥1 producto seleccionado |
| 5 | Resumen | Vista previa + descarga JSON + envío | — |

---

## Stack Elegido y Por Qué

### Next.js 14+ con App Router
- Ya era el stack del equipo para proyectos web
- App Router permite API Routes en el mismo repo (`/api/submit`)
- Server/Client split claro: datos estáticos del catálogo en server, wizard en client

### Tailwind CSS v4
- Versión instalada por `create-next-app` en 2026 (v4, sin tailwind.config.ts)
- Tokens de color definidos con `@theme {}` en `globals.css`
- **Importante para agentes futuros:** no existe `tailwind.config.ts`. Los colores custom (`brand-*`, `ink`, `success`) están en `src/app/globals.css` bajo `@theme`.

### Zustand + persist
- Estado global del wizard persiste en `localStorage` bajo la key `nxin_onboarding`
- Si el proveedor cierra el browser y vuelve, el wizard retoma desde el último paso
- `clearState()` se llama después del submit exitoso para limpiar
- Las imágenes (base64 dataUrl) también se persisten — puede volverse pesado si el proveedor sube muchas fotos grandes. Consideración futura: limitar a ~2MB por imagen.

### react-hook-form + Zod
- Cada paso tiene su propio schema Zod en `src/lib/schemas.ts`
- Paso 1 usa RHF completo; pasos 2–4 usan validación manual (estado en Zustand directo) por simplicidad dado que son formularios más dinámicos

### Google Sheets como backend operacional
- El equipo comercial ya vive en Google Sheets
- El webhook es un Google Apps Script (`google-sheets-webhook.js` en el repo hermano)
- **Routing en el webhook:** el campo `fuente` determina a qué hoja va el dato:
  - `'Wizard Onboarding'` → hoja `'Onboarding Proveedores'`
  - Cualquier otro → hoja `'Leads Landing'` (backward compat con landing anterior)
- El webhook recibe un payload **sin imágenes** (demasiado pesadas para Sheets). Las imágenes van solo en el JSON descargable.

---

## El JSON de Configuración de Tienda

Es el artefacto central del sistema. Contiene todo lo que el equipo chino necesita:

```
StoreConfig {
  metadata  → versión, sessionId, status: 'PENDING_UPLOAD'
  proveedor → datos de contacto completos
  ubicacion → dep/prov/dist/dirección
  tienda    → categoría, tagline, descripción, colorPrimario, logo (base64), banner (base64)
  catalogo  → array de productos con MOQ, precio, imagen (base64 si fue subida)
}
```

Nombre del archivo: `nxinmall_[empresa-slug]_[sessionId].json`

Las imágenes van **embebidas como base64 dataUrl** dentro del JSON. Decisión deliberada: el JSON es autosuficiente, no requiere un servidor de archivos. El equipo chino recibe un solo archivo con todo.

---

## Colores por Categoría

Cuando el proveedor selecciona su categoría en el Paso 2, se aplica `document.documentElement.style.setProperty('--store-color', colorPrimario)`. Esto permite que futuros agentes extiendan el UI para que todo el wizard adopte el color de la categoría.

| Categoría | Color |
|-----------|-------|
| frutas | `#2d8a4e` |
| flores | `#b5446e` |
| viveros | `#3a7d44` |
| empacadoras | `#c47d2e` |
| plasticos | `#1a6b8a` |
| insumos | `#7a5c2e` |

---

## Lo Que Este Sistema NO Hace (por diseño)

- **No se integra directamente** con la plataforma NxinMall china (no hay API disponible)
- **No envía email automático** al proveedor (está comentado en el webhook — activar cuando corresponda)
- **No tiene autenticación** — el wizard es público por intención: bajo fricción para el proveedor
- **No valida el RUC** contra SUNAT — es campo opcional, validación de formato solo (11 dígitos)
- **No sube imágenes a un CDN** — van embebidas en base64 en el JSON

---

## Decisiones Pendientes / Deuda Técnica

1. **Activar notificaciones por email** en el Google Apps Script (ya hay código comentado listo)
2. **Límite de tamaño de imágenes** — actualmente 5MB por imagen; si el JSON supera ~10MB puede fallar el POST a `/api/submit`. Solución futura: subir imágenes a S3/Cloudinary y guardar solo la URL en el JSON.
3. **Página `/registro`** — el plan original separaba el Paso 1 en `/registro`. Se decidió unificar todo en `/onboarding` (paso controlado por Zustand) para simplificar la navegación. Si en el futuro se quiere una URL directa al Paso 1, agregar un redirect `registro → onboarding` con el step seteado en 1.
4. **KYB automatizado** — la columna `KYB_STATUS` en Sheets es manual hoy. Candidato para automatizar con un servicio de verificación de empresas peruanas.
5. **Deploy** — el proyecto está listo para Vercel (`next build` pasa). Agregar `NEXT_PUBLIC_SHEETS_WEBHOOK_URL` como variable de entorno en Vercel.

---

## Archivos de Referencia Clave (repo hermano)

```
/Users/diego/Desktop/DataSet/NXIN_Mall_Peru_Launch/
├── landing/index.html          ← Landing original (HTML puro) — fuente del copy
├── landing/styles.css          ← Tokens de color originales
└── google-sheets-webhook.js    ← Webhook actualizado con routing dual
```

---

## Para el Próximo Agente

Si vas a modificar este proyecto, ten en cuenta:

1. **Tailwind v4**: los colores `brand-*` están en `globals.css`, no en un config file.
2. **El store de Zustand** es la fuente de verdad. Todos los componentes de pasos leen y escriben directo al store — no hay props drilling.
3. **Cada paso es autónomo**: los componentes Step[N].tsx incluyen su propio botón de navegación y validación. WizardShell es solo el layout exterior.
4. **El ubigeo es parcial**: `peru-ubigeo.ts` cubre los departamentos y provincias más importantes pero no es el dataset completo del INEI. Para un dataset completo (~1874 distritos) usar la fuente oficial del INEI o una librería como `ubigeo-peru`.
5. **El Google Apps Script** vive fuera de este repo en `NXIN_Mall_Peru_Launch/google-sheets-webhook.js`. Hay que copiarlo/actualizarlo manualmente en Google Apps Script.
