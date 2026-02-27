# ADR-0004: Estados del Pipeline de Leads y Onboardings

- **Estado:** Aceptado
- **Fecha:** 2026-02-27
- **Autores:** Diego + Claude Sonnet 4.6

---

## Contexto

Después de implementar el pipeline de leads (ADR-0002), existían dos problemas operacionales:

1. **Estado no transitaba automáticamente:** cuando un proveedor completaba el wizard, el lead en la tabla de administración seguía con estado `nuevo` o cualquier estado que el equipo hubiera asignado manualmente. El agente de operaciones tenía que recordar actualizar el estado a mano tras recibir la notificación de Sheets.

2. **Estado `kyb_pendiente` generaba ruido:** en la tabla de onboardings, el estado inicial al recibir un onboarding completo era `kyb_pendiente` (Know Your Business). Este término técnico de compliance confundía al equipo operativo, que no tiene un proceso de KYB formalizado. El estado agregaba un paso innecesario.

3. **Sin distinción entre "en onboarding" y "onboarding terminado":** el estado `onboarding` en leads significaba que el link había sido enviado, pero no había forma de saber si el proveedor ya había completado el wizard o aún estaba en proceso.

---

## Decisión

### 1. Transición automática de estado al completar el wizard

`POST /api/submit` (llamado al enviar el Step 5) ahora actualiza la tabla `leads` en Supabase además de insertar en `onboardings`:

```typescript
// Prioridad 1: match por invite_token (caso normal — llegó por link)
// Prioridad 2: match por email (fallback — acceso directo sin token)
const leadQuery = supabase.from('leads').update({ estado: 'completado' });
if (inviteToken) {
  await leadQuery.eq('invite_token', inviteToken);
} else {
  await leadQuery.eq('email', state.registro.email);
}
```

El `inviteToken` llega en el body porque `Step5Resumen` envía `JSON.stringify(store)` — el store completo del wizard incluye `inviteToken` aunque `OnboardingState` no lo declare en su tipo. Se extrae con `body.inviteToken ?? null`.

### 2. Nuevo estado `completado` para leads

Se añadió `completado` al enum de estados del pipeline de leads:

| Estado | Trigger | Color |
|--------|---------|-------|
| `nuevo` | POST `/api/leads` (automático) | Azul |
| `contactado` | Manual por ops | Ámbar |
| `onboarding` | Manual por ops al enviar el link | Verde |
| `completado` | POST `/api/submit` (automático) | Teal |
| `descartado` | Manual por ops | Gris |

La distinción entre `onboarding` y `completado` da visibilidad a dos momentos distintos del funnel:
- `onboarding` = "le enviamos el link, está en proceso"
- `completado` = "terminó el wizard, está listo para revisión"

### 3. Eliminación del estado `kyb_pendiente` en onboardings

El estado `kyb_pendiente` fue el estado inicial de todos los onboardings desde ADR-0001. Se decidió eliminarlo porque:

- El equipo no tiene un proceso KYB formalizado
- El término era técnico y ajeno al workflow operativo
- Añadía un click innecesario para pasar a "en revisión"

**Reemplazo:** los onboardings entran directamente con estado `en_revision`. El equipo lo aprueba o rechaza desde ahí.

Estados de onboardings tras el cambio:

| Estado | Significado |
|--------|-------------|
| `en_revision` | Estado inicial automático al recibir el wizard |
| `aprobado` | Manual — store activada en la plataforma china |
| `rechazado` | Manual — no califica o datos insuficientes |

---

## Esquema de Estados Actualizado

### Tabla `leads` (CHECK constraint a actualizar en Supabase)

```sql
-- Actualizar el CHECK constraint para incluir 'completado'
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_estado_check;
ALTER TABLE leads ADD CONSTRAINT leads_estado_check
  CHECK (estado IN ('nuevo', 'contactado', 'onboarding', 'completado', 'descartado'));
```

### Tabla `onboardings` (CHECK constraint a actualizar en Supabase)

```sql
-- Eliminar kyb_pendiente del CHECK constraint
ALTER TABLE onboardings DROP CONSTRAINT IF EXISTS onboardings_estado_check;
ALTER TABLE onboardings ADD CONSTRAINT onboardings_estado_check
  CHECK (estado IN ('en_revision', 'aprobado', 'rechazado'));

-- Migrar registros existentes con kyb_pendiente
UPDATE onboardings SET estado = 'en_revision' WHERE estado = 'kyb_pendiente';
```

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/app/api/submit/route.ts` | Actualiza `leads.estado = 'completado'` al recibir el wizard; cambia `onboardings.estado` inicial a `'en_revision'` |
| `src/data/admin-content.ts` | Añade `completado` a `leadStatuses` en es/en/pt; elimina `kyb_pendiente` de `onboardingStatuses` |
| `src/app/admin/(panel)/leads/LeadsTable.tsx` | Añade `completado` a `ESTADOS` y `ESTADO_STYLES` (color teal) |
| `src/app/admin/(panel)/onboardings/OnboardingsTable.tsx` | Elimina `kyb_pendiente`, fallback de `EstadoSelect` cambia a `en_revision` |

---

## Deuda Técnica Resuelta de ADR-0002

El punto 3 de deuda técnica de ADR-0002 quedó resuelto:

> ~~`estado` se actualiza manualmente en Supabase Studio — Pendiente~~
> ✅ **Resuelto:** `POST /api/submit` actualiza `leads.estado` automáticamente al completar el wizard.

---

## Consideraciones para el Futuro

1. **Notificación a ops al recibir `completado`:** hoy el equipo sabe que hay un onboarding listo porque llega la notificación en Google Sheets. Si el volumen escala, considerar un webhook o email automático cuando `leads.estado` cambia a `completado`.

2. **CHECK constraint en Supabase:** los cambios al enum de estados en el código no actualizan automáticamente los CHECK constraints en la DB. Ver las migraciones SQL en este ADR y ejecutarlas manualmente via Supabase Studio o MCP.

3. **Leads sin `invite_token`:** si un proveedor completa el wizard por acceso directo (sin link de ops), el fallback por email funciona. Sin embargo, si el email no coincide exactamente (typo en la landing vs. typo en el wizard), la actualización no ocurre. Solución futura: validar email en Step 1 contra el lead existente.
