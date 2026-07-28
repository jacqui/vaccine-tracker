"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { outbreakLocations } from "@/db/schema";

export async function addOutbreakLocation(formData: FormData) {
  const diseaseId = String(formData.get("diseaseId"));
  const country = String(formData.get("country"));
  const region = String(formData.get("region") || "") || null;
  const lat = Number(formData.get("lat"));
  const lon = Number(formData.get("lon"));
  const casesRaw = String(formData.get("cases") || "");
  const deathsRaw = String(formData.get("deaths") || "");
  const asOf = String(formData.get("asOf"));

  await db.insert(outbreakLocations).values({
    diseaseId,
    country,
    region,
    lat,
    lon,
    cases: casesRaw ? Number(casesRaw) : null,
    deaths: deathsRaw ? Number(deathsRaw) : null,
    asOf,
  });
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}

export async function deleteOutbreakLocation(id: number, diseaseId: string) {
  await db.delete(outbreakLocations).where(eq(outbreakLocations.id, id));
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}
