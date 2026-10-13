"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { StueckSchema, ersterFehler } from "@/lib/schemas";
import type { FormZustand } from "@/lib/typen";

export async function stueckSpeichern(_: FormZustand, formData: FormData): Promise<FormZustand> {
  await erfordereBenutzer("ADMIN", "BEARBEITER");

  const eingabe = StueckSchema.safeParse(Object.fromEntries(formData));
  if (!eingabe.success) return { fehler: ersterFehler(eingabe.error) };

  const { id, ...daten } = eingabe.data;
  const stueck = id
    ? await db.stueck.update({ where: { id }, data: daten })
    : await db.stueck.create({ data: daten });

  revalidatePath("/stuecke");
  redirect(`/stuecke/${stueck.id}`);
}
