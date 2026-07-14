CREATE TYPE "public"."outbreak_level" AS ENUM('none', 'monitoring', 'active');--> statement-breakpoint
CREATE TYPE "public"."vaccine_status" AS ENUM('available', 'in_trials', 'in_development', 'none');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinical_trials" (
	"id" serial PRIMARY KEY NOT NULL,
	"disease_id" varchar(64) NOT NULL,
	"nct_id" varchar(32) NOT NULL,
	"phase" text NOT NULL,
	"status" text NOT NULL,
	"sponsor" text,
	"url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diseases" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text[] DEFAULT '{}' NOT NULL,
	"epi_description" text NOT NULL,
	"epi_transmission" text,
	"epi_stats" text,
	"outbreak_level" "outbreak_level" DEFAULT 'none' NOT NULL,
	"outbreak_summary" text,
	"vaccine_status" "vaccine_status" NOT NULL,
	"available_vaccines" text[] DEFAULT '{}' NOT NULL,
	"vaccine_notes" text,
	"updated_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outbreak_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"disease_id" varchar(64) NOT NULL,
	"country" text NOT NULL,
	"region" text,
	"lat" real NOT NULL,
	"lon" real NOT NULL,
	"cases" integer,
	"deaths" integer,
	"as_of" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"disease_id" varchar(64) NOT NULL,
	"audience" text NOT NULL,
	"recommendation_text" text NOT NULL,
	"source_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"disease_id" varchar(64) NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"retrieved" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinical_trials" ADD CONSTRAINT "clinical_trials_disease_id_diseases_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."diseases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbreak_locations" ADD CONSTRAINT "outbreak_locations_disease_id_diseases_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."diseases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_disease_id_diseases_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."diseases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sources" ADD CONSTRAINT "sources_disease_id_diseases_id_fk" FOREIGN KEY ("disease_id") REFERENCES "public"."diseases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
