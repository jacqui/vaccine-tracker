"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sources } from "@/db/schema";

export async function addSource(formData: FormData) {
  const diseaseId = String(formData.get("diseaseId"));
  const name = String(formData.get("name"));
  const url = String(formData.get("url"));
  const retrieved = String(formData.get("retrieved"));

  await db.insert(sources).values({ diseaseId, name, url, retrieved });
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}

export async function deleteSource(id: number, diseaseId: string) {
  await db.delete(sources).where(eq(sources.id, id));
  revalidatePath(`/admin/diseases/${diseaseId}/edit`);
}
