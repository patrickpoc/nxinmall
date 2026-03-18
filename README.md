# NxinMall Onboarding & CRM Platform

This project is a centralized platform designed to optimize the supplier acquisition and onboarding process for **NxinMall**. It combines a high-impact landing page for advertising campaigns with a robust Leads (CRM) capture system and an automated onboarding flow.

## 🚀 Project Purpose

The main goal is to provide **local autonomy** to each country team so they can manage their own conversion funnel, enabling:
- Launch targeted advertising campaigns.
- Capture immediate contact information (Leads).
- Complete the supplier's business and technical profile (Onboarding) in a guided and efficient way.
- Maintain full control over local market content, categories, and validations.

### Phase 1 Strategy: Lightning Activation
The initial approach focuses on **generating real inventory** for NxinMall in record time:
1. **Local Collection:** The supplier uploads their best-selling products, photos, and technical sheets in the wizard.
2. **Bridge with China:** Structured data is sent to the development team in China for immediate publishing to the global platform.
3. **CRM Control:** Immediate follow-up via WhatsApp through the local admin panel.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) with App Router and TypeScript.
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Styling:** Tailwind CSS 4.0.
- **Form Validation:** React Hook Form + Zod.
- **State Management:** Zustand.
- **Infrastructure:** Deployed on Vercel.

## 📂 Project Structure

- `src/app/`: Application routes (Landing, Admin, Onboarding, API).
- `src/components/`: Modular components (UI, Landing, Onboarding Wizard).
- `src/lib/`: Supabase configuration, validation schemas, and utilities.
- `src/data/`: Static content, catalogs by category, and geographic data (Ubigeo).

## 🚦 User Flow

1. **Ad Campaign:** Users land on the Landing Page via social ads or search engines.
2. **Lead Registration:** Users fill out an initial contact form (Name, Company, WhatsApp).
3. **Onboarding Invitation:** The system generates a unique onboarding link.
4. **Onboarding Wizard:** A 5-step process to collect:
   - Company registration.
   - Business profile and certifications.
   - Logistics location.
   - Product catalog selection.
   - Summary and submission.

## 💻 Development

To start the local development server:

```bash
npm run dev
```

The project will be available at [http://localhost:3000](http://localhost:3000).

---

© 2026 NxinMall. Built for regional expansion and operational autonomy.
