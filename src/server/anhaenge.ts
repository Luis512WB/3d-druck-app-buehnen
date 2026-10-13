"use server";

import { revalidatePath } from "next/cache";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import type { FormZustand } from "@/lib/typen";
import { dateiSpeichern, dateienLoeschen } from "@/lib/uploads";

type Zuordnung = { auftragId: number | null; stueckId: number | null; bibliothekseintragId: number | null };

function seiteVon(z: Zuordnung) {
  if (z.auftragId) return `/auftraege/${z.auftragId}`;
  if (z.stueckId) return `/stuecke/${z.stueckId}`;
  return `/bibliothek/${z.bibliothekseintragId}`;
}

export async function anhaengeHochladen(_: FormZustand, formData: FormData): Promise<FormZustand> {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");

  const zuordnung: Zuordnung = {
    auftragId: Number(formData.get("auftragId")) || null,
    stueckId: Number(formData.get("stueckId")) || null,
    bibliothekseintragId: Number(formData.get("bibliothekseintragId")) || null,
  };
  if (Object.values(zuordnung).filter(Boolean).length !== 1) return { fehler: "Zuordnung fehlt." };

  const dateien = formData.getAll("dateien").filter((d): d is File => d instanceof File && d.size > 0);
  if (dateien.length === 0) return { fehler: "Keine Datei ausgewählt." };

  const ordner = zuordnung.auftragId
    ? `auftrag-${zuordnung.auftragId}`
    : zuordnung.stueckId
      ? `stueck-${zuordnung.stueckId}`
      : `bibliothek-${zuordnung.bibliothekseintragId}`;

  for (const datei of dateien) {
    const gespeichert = await dateiSpeichern(datei, ordner);
    await db.anhang.create({ data: { ...zuordnung, ...gespeichert, hochgeladenVonId: benutzer.id } });
  }

  revalidatePath(seiteVon(zuordnung));
  return { ok: true };
}

export async function anhangLoeschen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const anhang = await db.anhang.delete({ where: { id: Number(formData.get("id")) } });
  await dateienLoeschen(anhang);
  revalidatePath(seiteVon(anhang));
}
