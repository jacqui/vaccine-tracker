# Is there a vaccine for that?

A plain-language tracker for disease outbreaks and vaccine status. Next.js
front end, Postgres via Drizzle, Python scripts for data gathering.

## Stack

- **Next.js 14** (App Router, TypeScript) — the web app
- **Drizzle ORM** + **Neon** (serverless Postgres) — the data layer
- **Tailwind CSS** — styling, using the design tokens from the original scaffold
- **Python** — separate ETL scripts for pulling from WHO and ClinicalTrials.gov

## Local setup

1. **Create a free Neon database.** Sign up at [neon.tech](https://neon.tech),
   create a project, and copy the pooled connection string from the dashboard.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set your database URL**
   ```bash
   cp .env.example .env
   # then paste your Neon connection string into .env
   ```
   (Drizzle Kit's CLI looks for `.env` by default, not `.env.local` — Next.js
   itself is happy with either, so `.env` is the simpler choice here.)

4. **Push the schema to your database**
   ```bash
   npm run db:push
   ```

5. **Seed example data**
   ```bash
   npm run db:seed
   ```

6. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Deploying (free)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repo.
3. Vercel will detect Next.js automatically. Add `DATABASE_URL` as an
   environment variable in the Vercel project settings (same value as your
   `.env.local`).
4. Deploy. That's it — no separate server to manage.

Tip: Vercel has a native Neon integration (Storage tab in your project) that
can provision the database and wire the env var for you automatically, if
you'd rather not copy the connection string by hand.

## The Python ETL scripts

These are intentionally kept separate from the Next.js app — they're for
gathering and reconciling data, not for serving the site.

```bash
cd scripts/etl
pip install -r requirements.txt --break-system-packages   # or use a venv

python fetch_who_outbreaks.py
python fetch_clinical_trials.py "Ebola"
```

Both are stubs that print what they find rather than writing to the database
directly — the useful next step is eyeballing a few real responses, since
disease naming is inconsistent across sources (this is the "translation
layer" work that's the actual point of the project). Once you've settled on
a reconciliation approach, extend these to write into the same Postgres
database (`psycopg2` is already in requirements.txt) or to output a JSON/CSV
file that a small script upserts into Drizzle.

A natural next step: run these on a schedule via GitHub Actions, the same
pattern as your Daily Digest app.

## Project structure

```
src/
  app/
    page.tsx                 # disease list (home page)
    disease/[id]/page.tsx    # disease detail page
    components/StatusBadge.tsx
    globals.css
  db/
    schema.ts                # Drizzle schema — the data model
    index.ts                 # DB client
scripts/
  seed.ts                    # example data
  etl/
    fetch_who_outbreaks.py
    fetch_clinical_trials.py
drizzle.config.ts
tailwind.config.ts
```

## Known placeholders to fix before this is "real"

- The Ebola trial's `nct_id` in `scripts/seed.ts` is a placeholder — look up
  the actual NCT ID on ClinicalTrials.gov and replace it.
- `fetch_who_outbreaks.py`'s field names (`Title`, `PublicationDateAndTime`)
  are best-guess based on WHO's general OData API conventions — run it once
  and adjust field names to match the real response shape.
