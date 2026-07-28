"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { recommendations } from "@/db/schema";

export async function addRecommendation(formData: FormData) {
  const diseaseId = String(formData.get("diseaseId"));
  const audience = String(formData.get("audience"));
  const recommendationText = String(formData.get("recommendationText"));
  const sourceUrl = String(formData.get("sourceUrl") || "") || null;

  await db
    .insert(recommendations)
    .values({ diseaseId, audience, recommendationText, sourceUrl });
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}

export async function deleteRecommendation(id: number, diseaseId: string) {
  await db.delete(recommendations).where(eq(recommendations.id, id));
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}
