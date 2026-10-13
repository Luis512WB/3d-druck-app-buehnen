"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { sitzungBeenden, sitzungStarten } from "@/lib/sitzung";

const AnmeldeSchema = z.object({
  email: z.email(),
  passwort: z.string().min(1),
});

export type AnmeldeZustand = { fehler?: string };

const FEHLER = "E-Mail oder Passwort stimmt nicht.";

export async function anmelden(_: AnmeldeZustand, formData: FormData): Promise<AnmeldeZustand> {
  const eingabe = AnmeldeSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    passwort: formData.get("passwort"),
  });
  if (!eingabe.success) return { fehler: FEHLER };

  const benutzer = await db.benutzer.findUnique({ where: { email: eingabe.data.email } });
  const passt =
    benutzer?.aktiv === true && (await bcrypt.compare(eingabe.data.passwort, benutzer.passwortHash));
  if (!benutzer || !passt) return { fehler: FEHLER };

  await sitzungStarten(benutzer.id);
  redirect("/");
}

export async function abmelden() {
  await sitzungBeenden();
  redirect("/login");
}
