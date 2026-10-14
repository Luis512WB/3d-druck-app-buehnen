"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import type { FormZustand } from "@/lib/typen";
import { DARSTELLUNGEN } from "@/lib/werte";

export async function abteilungAnlegen(_: FormZustand, formData: FormData): Promise<FormZustand> {
  await erfordereBenutzer("ADMIN");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { fehler: "Bitte einen Namen eingeben." };

  const vorhanden = await db.abteilung.findUnique({ where: { name } });
  if (vorhanden?.aktiv) return { fehler: "Diese Abteilung gibt es schon." };
  if (vorhanden) await db.abteilung.update({ where: { id: vorhanden.id }, data: { aktiv: true } });
  else await db.abteilung.create({ data: { name, farbeHex: String(formData.get("farbeHex") || "#6B7280") } });

  revalidatePath("/einstellungen");
  return { ok: true };
}

// Ausblenden statt löschen, damit alte Aufträge ihre Abteilung behalten.
export async function abteilungAusblenden(formData: FormData) {
  await erfordereBenutzer("ADMIN");
  await db.abteilung.update({ where: { id: Number(formData.get("id")) }, data: { aktiv: false } });
  revalidatePath("/einstellungen");
}

export async function kategorieAnlegen(_: FormZustand, formData: FormData): Promise<FormZustand> {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { fehler: "Bitte einen Namen eingeben." };
  if (await db.bibliothekskategorie.findUnique({ where: { name } })) {
    return { fehler: "Diese Kategorie gibt es schon." };
  }

  const anzahl = await db.bibliothekskategorie.count();
  await db.bibliothekskategorie.create({ data: { name, reihenfolge: anzahl } });
  revalidatePath("/einstellungen");
  return { ok: true };
}

export async function passwortAendern(_: FormZustand, formData: FormData): Promise<FormZustand> {
  const benutzer = await erfordereBenutzer();
  const alt = String(formData.get("alt") ?? "");
  const neu = String(formData.get("neu") ?? "");
  if (neu.length < 8) return { fehler: "Das neue Passwort braucht mindestens 8 Zeichen." };

  const konto = await db.benutzer.findUnique({ where: { id: benutzer.id } });
  if (!konto || !(await bcrypt.compare(alt, konto.passwortHash))) {
    return { fehler: "Das bisherige Passwort stimmt nicht." };
  }

  await db.benutzer.update({ where: { id: benutzer.id }, data: { passwortHash: await bcrypt.hash(neu, 12) } });
  return { ok: true };
}

export async function darstellungSetzen(formData: FormData) {
  await erfordereBenutzer();
  const wert = String(formData.get("darstellung"));
  if (!(wert in DARSTELLUNGEN)) return;
  (await cookies()).set("darstellung", wert, { path: "/", maxAge: 60 * 60 * 24 * 365 * 5, sameSite: "lax" });
  revalidatePath("/", "layout");
}
