/**
 * Data model for "Is there a vaccine for that?"
 *
 * Same shape as the original Pydantic sketch, ported to Drizzle/Postgres:
 *   diseases            -- one row per disease
 *   outbreak_locations  -- 0..n per disease, only populated when outbreak.level = 'active'/'monitoring'
 *   clinical_trials     -- 0..n per disease
 *   recommendations     -- 0..n per disease, one per audience
 *   sources             -- 0..n per disease, provenance for citations
 *
 * Normalized into real tables instead of nested JSON so you can query
 * across diseases later (e.g. "all diseases with an active outbreak and
 * no available vaccine") without unpacking JSON blobs.
 */

import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  real,
  integer,
  date,
  pgEnum,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const vaccineStatusEnum = pgEnum("vaccine_status", [
  "available",
  "in_trials",
  "in_development",
  "none",
]);

export const outbreakLevelEnum = pgEnum("outbreak_level", [
  "none",
  "monitoring",
  "active",
]);

export const diseases = pgTable("diseases", {
  id: varchar("id", { length: 64 }).primaryKey(), // slug, e.g. "ebola-bundibugyo"
  name: text("name").notNull(),
  category: text("category").array().notNull().default([]), // e.g. ["outbreak-prone"]

  // epidemiology
  epiDescription: text("epi_description").notNull(),
  epiTransmission: text("epi_transmission"),
  epiStats: text("epi_stats"), // JSON string of {label: value} pairs, small enough not to normalize

  // outbreak (nullable — most diseases have no active outbreak)
  outbreakLevel: outbreakLevelEnum("outbreak_level").notNull().default("none"),
  outbreakSummary: text("outbreak_summary"),

  // vaccine
  vaccineStatus: vaccineStatusEnum("vaccine_status").notNull(),
  availableVaccines: text("available_vaccines").array().notNull().default([]),
  vaccineNotes: text("vaccine_notes"),

  updatedAt: date("updated_at").notNull().defaultNow(),
});

export const outbreakLocations = pgTable("outbreak_locations", {
  id: serial("id").primaryKey(),
  diseaseId: varchar("disease_id", { length: 64 })
    .notNull()
    .references(() => diseases.id),
  country: text("country").notNull(),
  region: text("region"),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  cases: integer("cases"),
  deaths: integer("deaths"),
  asOf: date("as_of").notNull(),
});

export const clinicalTrials = pgTable("clinical_trials", {
  id: serial("id").primaryKey(),
  diseaseId: varchar("disease_id", { length: 64 })
    .notNull()
    .references(() => diseases.id),
  nctId: varchar("nct_id", { length: 32 }).notNull(),
  phase: text("phase").notNull(), // "PHASE1" | "PHASE2" | "PHASE3" | "PHASE4" | "EARLY_PHASE1"
  status: text("status").notNull(), // "RECRUITING" | "COMPLETED" | etc, mirrors ClinicalTrials.gov values
  sponsor: text("sponsor"),
  url: text("url"),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  diseaseId: varchar("disease_id", { length: 64 })
    .notNull()
    .references(() => diseases.id),
  audience: text("audience").notNull(), // e.g. "Pregnant women"
  recommendationText: text("recommendation_text").notNull(),
  sourceUrl: text("source_url"),
});

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  diseaseId: varchar("disease_id", { length: 64 })
    .notNull()
    .references(() => diseases.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  retrieved: date("retrieved").notNull(),
});

// ---------- relations, so queries can pull a disease with everything attached ----------

export const diseasesRelations = relations(diseases, ({ many }) => ({
  outbreakLocations: many(outbreakLocations),
  clinicalTrials: many(clinicalTrials),
  recommendations: many(recommendations),
  sources: many(sources),
}));

export const outbreakLocationsRelations = relations(outbreakLocations, ({ one }) => ({
  disease: one(diseases, {
    fields: [outbreakLocations.diseaseId],
    references: [diseases.id],
  }),
}));

export const clinicalTrialsRelations = relations(clinicalTrials, ({ one }) => ({
  disease: one(diseases, {
    fields: [clinicalTrials.diseaseId],
    references: [diseases.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  disease: one(diseases, {
    fields: [recommendations.diseaseId],
    references: [diseases.id],
  }),
}));

export const sourcesRelations = relations(sources, ({ one }) => ({
  disease: one(diseases, {
    fields: [sources.diseaseId],
    references: [diseases.id],
  }),
}));
