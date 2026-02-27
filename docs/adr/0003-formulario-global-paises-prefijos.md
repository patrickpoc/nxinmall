# ADR-0003: Formulario Global con País Inteligente y Prefijos Telefónicos

- **Estado:** Aceptado
- **Fecha:** 2026-02-27
- **Autores:** Diego + Claude Sonnet 4.6

---

## Contexto

El formulario de captación (landing) y el wizard de onboarding tenían listas de países hardcodeadas y reducidas (Peru, Brasil, Colombia, Ecuador, Chile, Argentina) que no reflejaban el alcance global de NxinMall. Adicionalmente:

- Los placeholders del formulario de la landing mostraban nombres de ejemplo genéricos ("Maria Perez", "Agroexportadora Andina") en lugar de textos contextuales según el idioma.
- El prefijo telefónico del campo WhatsApp era estático (+51) sin reaccionar al país seleccionado.
- Al cambiar el idioma a Português en el wizard, el campo país no cambiaba automáticamente a Brasil.
- Al cambiar el país en el wizard, el formulario (react-hook-form) no sincronizaba el cambio porque solo usa `defaultValues` al montar.
- El panel de administración de leads tenía un filtro de país con una lista hardcoded que incluía países sin onboardings reales (Chile, Argentina).

---

## Decisión

### 1. Fuente única de países: `src/data/countries.ts`

Se creó un archivo de datos compartido con ~80 países agrupados en 4 regiones:

```
América      (23 países) — Latinoamérica + Norteamérica
Europa       (29 países) — UE + Reino Unido + Rusia + Turquía + Ucrania
Asia y Oceanía (21 países) — Asia Pacífico + Oceanía + Oriente Medio
África y Medio Oriente (16 países)
```

Exporta:
- `COUNTRIES: Country[]` — array con `{ name, prefix, region }`
- `REGION_LABELS` — labels de región en español
- `REGIONS` — orden fijo de regiones para los `<optgroup>`
- `getCountryPrefix(name)` — helper que retorna el prefijo o `'+'` como fallback
- `UBIGEO_COUNTRIES` — los 4 países con datos de ubigeo completos (Peru, Brasil, Colombia, Ecuador)
- `hasUbigeo(country)` — type guard para saber si el país tiene dropdowns de ubicación

Todos los selectores de país usan `<optgroup>` por región para mejorar la navegabilidad con ~80 opciones.

### 2. Prefijo telefónico reactivo

El badge de prefijo junto al campo WhatsApp ahora deriva de `getCountryPrefix(paisSeleccionado)` en lugar de un objeto de mapeo local. Se actualiza instantáneamente al cambiar el select de país.

**Landing (`ContactAndFaq.tsx`):** `selectedCountry` en estado React → `prefix = getCountryPrefix(selectedCountry)` renderizado como badge no editable.

**Wizard (`Step1Registro.tsx`):** `watch('pais')` de react-hook-form → `defaultCountryCode={getCountryPrefix(paisSeleccionado)}` en el componente `PhoneInput`.

### 3. Idioma → País automático

**Wizard:** `setIdioma` en el store de Zustand actualiza `idioma` Y también `registro.pais = 'Brasil'` cuando `idioma === 'pt'`. Un `useEffect` en `Step1Registro` sincroniza el campo del formulario con `registro.pais` cada vez que cambia en el store.

**Landing:** `useEffect` en `ContactForm` que observa el prop `lang` — cuando `lang === 'pt'` establece `selectedCountry = 'Brasil'` automáticamente.

### 4. Placeholders localizados por idioma

Se eliminaron los placeholders genéricos. Ahora varían según `lang`:

| Lang | Nombre | Empresa | Email |
|------|--------|---------|-------|
| `es` | Tu nombre completo | Tu empresa | tu@empresa.com |
| `en` | Your full name | Your company | you@company.com |
| `pt` | Seu nome completo | Sua empresa | voce@empresa.com |

### 5. Orden de campos en el formulario de la landing

Reordenados para que el país quede **antes** de email y WhatsApp:

```
[ Nombre          ] [ Empresa        ]
[ País (full width)                  ]
[ Email           ] [ WhatsApp +XX   ]
```

Así cuando el usuario llega al campo WhatsApp, el prefijo ya está correcto.

### 6. Step3 con fallback para países sin ubigeo

El Step 3 del wizard (Ubicación) tenía dropdowns encadenados solo para Peru, Brasil, Colombia y Ecuador. Si el usuario seleccionaba otro país, los dropdowns quedaban vacíos.

**Solución:** `hasUbigeo(pais)` determina el modo de renderizado:
- `true` → comportamiento actual (dropdowns encadenados con datos del ubigeo)
- `false` → dos inputs de texto libre: "Región / Estado" y "Ciudad"

Los valores se almacenan en los mismos campos del store (`ubicacion.departamento` y `ubicacion.provincia`) para mantener compatibilidad con el JSON de configuración.

### 7. Filtro de país en admin simplificado

El select de filtro de país en `/admin/leads` y `/admin/onboardings` muestra solo las opciones operacionalmente relevantes:

```
Todos | Peru | Brasil | Colombia | Ecuador | Otros
```

"Otros" filtra todos los registros cuyo `pais` no pertenece a `UBIGEO_COUNTRIES`. Esto evita que el filtro crezca indefinidamente con los ~80 países ahora disponibles.

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/data/countries.ts` | **Nuevo** — fuente única de países |
| `src/components/landing/ContactAndFaq.tsx` | País inteligente, prefijo reactivo, placeholders localizados, reorden de campos |
| `src/app/page.tsx` | Pasa `lang` a `<ContactForm>` |
| `src/lib/store.ts` | `setIdioma('pt')` → también setea `pais = 'Brasil'` |
| `src/components/wizard/steps/Step1Registro.tsx` | `useEffect` para sincronizar form con store, `getCountryPrefix`, `<optgroup>` por región |
| `src/components/wizard/steps/Step3Ubicacion.tsx` | Todos los países en el select, fallback texto libre para países sin ubigeo |
| `src/app/admin/(panel)/leads/LeadsTable.tsx` | Usa `UBIGEO_COUNTRIES`, filtro simplificado |
| `src/app/admin/(panel)/onboardings/OnboardingsTable.tsx` | Filtro de país añadido, país visible en columna empresa |
| `src/data/admin-content.ts` | `countries.others` añadido en los 3 idiomas |

---

## Decisiones Descartadas

| Alternativa | Por qué se descartó |
|-------------|---------------------|
| Librería `react-phone-input-2` | Dependencia externa innecesaria; el badge simple es suficiente para el caso de uso |
| Select de prefijo independiente del país | Añade complejidad de UX sin beneficio real; el país ya determina el prefijo |
| Traducciones de nombres de país por idioma | Aumenta la complejidad del catálogo; los nombres en español son reconocibles globalmente para el segmento B2B agro |

---

## Consideraciones para el Futuro

1. **Ubigeo global:** actualmente solo Peru, Brasil, Colombia y Ecuador tienen datos de divisiones administrativas. Para otros países, el proveedor ingresa texto libre. Si NxinMall escala a un mercado específico (ej. España, México), agregar el ubigeo correspondiente en `src/data/ubigeo-[pais].ts` y extender `hasUbigeo` y `Step3Ubicacion`.

2. **Idioma inglés en el wizard:** el wizard solo tiene `'es'` y `'pt'`. El `'en'` existe en la landing pero no en el wizard. Si NxinMall captaría proveedores anglófonos directamente, extender `Idioma` en `i18n.ts` y el store.

3. **Prefijo en el payload:** el prefijo telefónico se muestra visualmente pero no se concatena al número en el valor del input. El campo `whatsapp` en Supabase almacena solo el número local. Evaluar si es necesario guardar el número E.164 completo para integraciones futuras con APIs de WhatsApp Business.
