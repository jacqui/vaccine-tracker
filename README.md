# Is there a vaccine for that?

A proof-of-concept exploring how current disease outbreaks map against vaccination status, and a test case for using Claude to rapidly prototype a data project. Sources include the [Australian Immunisation Handbook](https://immunisationhandbook.health.gov.au/contents) and [WHO Disease Outbreak News alerts](https://www.who.int/emergencies/disease-outbreak-news).

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
