# Supabase setup

## Environment variables

Create a `.env.local` (see project root `.env.example`) with:

- `NEXT_PUBLIC_SUPABASE_URL` – e.g. `https://xxxxx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – from Dashboard → Settings → API (anon public)
- `SUPABASE_SERVICE_ROLE_KEY` – from Dashboard → Settings → API (service_role, keep secret)

## Tables required for Admin Content

The Admin **Content** page and the public site content API need these tables in your Supabase project:

- `public.site_content` – editable landing content per block and language
- `public.site_content_changelog` – last 10 changes for history and restore

### Option A: Supabase CLI

If you use the Supabase CLI and link this project:

```bash
supabase db push
```

### Option B: SQL Editor (Dashboard)

If you don’t use the CLI, run the migration SQL manually:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor**.
3. Copy the contents of `supabase/migrations/20250311000000_create_site_content_tables.sql` and run it.

After that, the error *"Could not find the table 'public.site_content' in the schema cache"* should be resolved.

## Storage (optional, for hero image uploads)

To use **Upload from device** in Admin → Content → Images (hero slider):

1. In Supabase Dashboard go to **Storage** and create a bucket named `content`.
2. Set the bucket to **Public** so uploaded hero images are viewable by the site.
3. If the bucket is private, you will need to use signed URLs or a policy that allows public read.
