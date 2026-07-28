"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { diseases } from "@/db/schema";
import { COOKIE_NAME } from "@/lib/auth";

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function deleteDisease(id: string) {
  await db.delete(diseases).where(eq(diseases.id, id));
  revalidatePath("/admin");
}
