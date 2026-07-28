"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clinicalTrials } from "@/db/schema";

export async function addClinicalTrial(formData: FormData) {
  const diseaseId = String(formData.get("diseaseId"));
  const nctId = String(formData.get("nctId"));
  const phase = String(formData.get("phase"));
  const status = String(formData.get("status"));
  const sponsor = String(formData.get("sponsor") || "") || null;
  const url = String(formData.get("url") || "") || null;

  await db
    .insert(clinicalTrials)
    .values({ diseaseId, nctId, phase, status, sponsor, url });
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}

export async function deleteClinicalTrial(id: number, diseaseId: string) {
  await db.delete(clinicalTrials).where(eq(clinicalTrials.id, id));
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}
