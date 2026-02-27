# NxinMall Onboarding & CRM Platform

Este proyecto es una plataforma centralizada diseñada para optimizar el proceso de adquisición y registro de proveedores para **NxinMall**. Combina una landing page de alto impacto para pautas publicitarias con un sistema robusto de captura de Leads (CRM) y un flujo de Onboarding automatizado.

## 🚀 Propósito del Proyecto

El objetivo principal es proporcionar **autonomía local** a los equipos de cada país para gestionar su propio embudo de conversión, permitiendo:
- Lanzar pautas publicitarias dirigidas.
- Capturar información de contacto inmediata (Leads).
- Completar el perfil comercial y técnico del proveedor (Onboarding) de forma guiada y eficiente.
- Tener control total sobre el contenido, categorías y validaciones del mercado local.

### Estrategia de Fase 1: Activación Relámpago
El enfoque inicial está centrado en la **generación de inventario real** para NxinMall en tiempo récord:
1. **Recopilación Local:** El proveedor carga sus productos estrella, fotos y fichas técnicas en el wizard.
2. **Puente con China:** La data estructurada se envía al equipo de desarrollo en China para su subida inmediata a la plataforma global.
3. **Control CRM:** Seguimiento inmediato vía WhatsApp a través del panel administrativo local.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15+](https://nextjs.org/) con App Router y TypeScript.
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Estilos:** Tailwind CSS 4.0.
- **Validación de Formularios:** React Hook Form + Zod.
- **Estado:** Zustand.
- **Infraestructura:** Despliegue en Vercel.

## 📂 Estructura del Proyecto

- `src/app/`: Rutas de la aplicación (Landing, Admin, Onboarding, API).
- `src/components/`: Componentes modulares (UI, Landing, Wizard de Onboarding).
- `src/lib/`: Configuración de Supabase, esquemas de validación y utilidades.
- `src/data/`: Contenido estático, catálogos por categoría y datos geográficos (Ubigeo).

## 🚦 Flujo del Usuario

1. **Pauta Publicitaria:** El usuario llega a la Landing Page desde anuncios en redes sociales o buscadores.
2. **Registro de Lead:** El usuario completa un formulario de contacto inicial (Nombre, Empresa, WhatsApp).
3. **Invitación al Onboarding:** El sistema genera un enlace único de onboarding.
4. **Wizard de Onboarding:** Un proceso de 5 pasos para recolectar:
   - Registro de empresa.
   - Perfil comercial y certificados.
   - Ubicación logística.
   - Selección de catálogo de productos.
   - Resumen y envío.

## 💻 Desarrollo

Para iniciar el servidor de desarrollo local:

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000).

---

© 2026 NxinMall. Desarrollado para la expansión regional y autonomía operativa.
