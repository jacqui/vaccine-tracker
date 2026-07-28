"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { diseases } from "@/db/schema";

function parseFormData(formData: FormData) {
  const category = String(formData.get("category") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const availableVaccines = String(formData.get("availableVaccines") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: String(formData.get("id")),
    name: String(formData.get("name")),
    category,
    epiDescription: String(formData.get("epiDescription")),
    epiTransmission: String(formData.get("epiTransmission") || "") || null,
    epiStats: String(formData.get("epiStats") || "") || null,
    outbreakLevel: String(formData.get("outbreakLevel")) as
      | "none"
      | "monitoring"
      | "active",
    outbreakSummary: String(formData.get("outbreakSummary") || "") || null,
    vaccineStatus: String(formData.get("vaccineStatus")) as
      | "available"
      | "in_trials"
      | "in_development"
      | "none",
    availableVaccines,
    vaccineNotes: String(formData.get("vaccineNotes") || "") || null,
  };
}

export async function createDisease(formData: FormData) {
  const data = parseFormData(formData);
  await db.insert(diseases).values(data);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateDisease(formData: FormData) {
  const data = parseFormData(formData);
  await db
    .update(diseases)
    .set({ ...data, updatedAt: new Date().toISOString().slice(0, 10) })
    .where(eq(diseases.id, data.id));
  revalidatePath("/admin");
  redirect("/admin");
}
