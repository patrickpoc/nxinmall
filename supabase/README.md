# Supabase setup

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
