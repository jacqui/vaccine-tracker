/**
 * Run with: npm run db:seed
 * Populates the database with the two worked examples from our data model
 * sketch: an active-outbreak disease (Ebola) and a routine one (pertussis).
 */

import "dotenv/config"; // tsx doesn't auto-load .env the way Next.js does — load it explicitly
import { db } from "@/db";
import {
  diseases,
  outbreakLocations,
  clinicalTrials,
  recommendations,
  sources,
} from "@/db/schema";

async function seed() {
  console.log("Seeding diseases...");

  await db.insert(diseases).values([
    {
      id: "ebola-bundibugyo",
      name: "Ebola (Bundibugyo species)",
      category: ["outbreak-prone"],
      epiDescription:
        "A haemorrhagic fever caused by the Bundibugyo strain of ebolavirus, spread through contact with bodily fluids of infected people or animals.",
      epiTransmission:
        "Direct contact with blood, secretions, or other bodily fluids of infected people or animals",
      epiStats: JSON.stringify({
        case_fatality_rate: "25-50% (strain-dependent)",
        incubation_period: "2-21 days",
      }),
      outbreakLevel: "active",
      outbreakSummary:
        "Public health emergency declared 17 May 2026 following an outbreak in the Democratic Republic of Congo.",
      vaccineStatus: "in_trials",
      availableVaccines: [],
      vaccineNotes:
        "First-in-human Phase 1 trial began 13 July 2026, fast-tracked in response to the DRC outbreak. Recruiting 50 healthy adults aged 18-55.",
    },
    {
      id: "pertussis",
      name: "Whooping cough (Pertussis)",
      category: ["routine-vaccine-preventable"],
      epiDescription:
        "A highly contagious bacterial respiratory infection causing severe coughing fits, particularly dangerous for infants under 6 months.",
      epiTransmission: "Airborne droplets from coughing or sneezing",
      epiStats: JSON.stringify({
        infant_hospitalisation_rate: "high in unvaccinated infants under 6 months",
      }),
      outbreakLevel: "none",
      vaccineStatus: "available",
      availableVaccines: ["dTpa (adult/adolescent booster)", "DTPa (child primary course)"],
      vaccineNotes: "Routinely available on Australia's National Immunisation Program.",
    },
  ]);

  await db.insert(outbreakLocations).values([
    {
      diseaseId: "ebola-bundibugyo",
      country: "Democratic Republic of Congo",
      lat: -4.038,
      lon: 21.758,
      asOf: "2026-07-01",
    },
  ]);

  await db.insert(clinicalTrials).values([
    {
      diseaseId: "ebola-bundibugyo",
      nctId: "PLACEHOLDER-NCT", // replace once you look up the real NCT ID
      phase: "PHASE1",
      status: "RECRUITING",
      sponsor: "University of Oxford",
      url: "https://clinicaltrials.gov/",
    },
  ]);

  await db.insert(recommendations).values([
    {
      diseaseId: "ebola-bundibugyo",
      audience: "General public (non-outbreak regions)",
      recommendationText: "No action needed; risk outside affected regions is very low.",
    },
    {
      diseaseId: "ebola-bundibugyo",
      audience: "Travellers to affected regions",
      recommendationText:
        "Check current travel advisories before departure and avoid contact with sick individuals or wildlife.",
    },
    {
      diseaseId: "pertussis",
      audience: "Pregnant women",
      recommendationText:
        "A pertussis-containing vaccine is recommended in every pregnancy, ideally between 20 and 32 weeks, to pass protective antibodies to the baby before birth.",
      sourceUrl: "https://immunisationhandbook.health.gov.au/",
    },
    {
      diseaseId: "pertussis",
      audience: "Anyone in close contact with a newborn",
      recommendationText:
        "Adults who will be around a new baby (partners, grandparents, carers) are encouraged to have a booster if it's been more than 10 years since their last one.",
      sourceUrl: "https://immunisationhandbook.health.gov.au/",
    },
  ]);

  await db.insert(sources).values([
    {
      diseaseId: "ebola-bundibugyo",
      name: "WHO Disease Outbreak News",
      url: "https://www.who.int/emergencies/disease-outbreak-news",
      retrieved: "2026-07-14",
    },
    {
      diseaseId: "pertussis",
      name: "Australian Immunisation Handbook",
      url: "https://immunisationhandbook.health.gov.au/",
      retrieved: "2026-07-14",
    },
  ]);

  console.log("Done.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
