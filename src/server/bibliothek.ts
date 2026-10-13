"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { BibliothekSchema, ersterFehler } from "@/lib/schemas";
import type { FormZustand } from "@/lib/typen";
import { dateienLoeschen } from "@/lib/uploads";

export async function eintragSpeichern(_: FormZustand, formData: FormData): Promise<FormZustand> {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");

  const eingabe = BibliothekSchema.safeParse(Object.fromEntries(formData));
  if (!eingabe.success) return { fehler: ersterFehler(eingabe.error) };

  const { id, ...daten } = eingabe.data;
  const eintrag = id
    ? await db.bibliothekseintrag.update({ where: { id }, data: daten })
    : await db.bibliothekseintrag.create({ data: { ...daten, erstelltVonId: benutzer.id } });

  revalidatePath("/bibliothek");
  redirect(`/bibliothek/${eintrag.id}`);
}

export async function eintragLoeschen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const id = Number(formData.get("id"));
  const anhaenge = await db.anhang.findMany({ where: { bibliothekseintragId: id } });

  await db.bibliothekseintrag.delete({ where: { id } });
  await Promise.all(anhaenge.map(dateienLoeschen));

  revalidatePath("/bibliothek");
  redirect("/bibliothek");
}
