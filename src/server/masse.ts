"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { MassSchema, ersterFehler } from "@/lib/schemas";
import type { FormZustand } from "@/lib/typen";

function seiteVon(m: { auftragId: number | null; bibliothekseintragId: number | null }) {
  return m.auftragId ? `/auftraege/${m.auftragId}` : `/bibliothek/${m.bibliothekseintragId}`;
}

export async function massHinzufuegen(_: FormZustand, formData: FormData): Promise<FormZustand> {
  await erfordereBenutzer("ADMIN", "BEARBEITER");

  const eingabe = MassSchema.safeParse(Object.fromEntries(formData));
  if (!eingabe.success) return { fehler: ersterFehler(eingabe.error) };
  const daten = eingabe.data;
  if (!daten.auftragId === !daten.bibliothekseintragId) return { fehler: "Zuordnung fehlt." };

  const letztes = await db.mass.findFirst({
    where: { auftragId: daten.auftragId, bibliothekseintragId: daten.bibliothekseintragId },
    orderBy: { reihenfolge: "desc" },
    select: { reihenfolge: true },
  });
  await db.mass.create({ data: { ...daten, reihenfolge: (letztes?.reihenfolge ?? 0) + 1 } });

  revalidatePath(seiteVon(daten));
  return { ok: true };
}

export async function massLoeschen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const mass = await db.mass.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath(seiteVon(mass));
}

export async function massGeprueftUmschalten(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const id = Number(formData.get("id"));
  const mass = await db.mass.findUnique({ where: { id } });
  if (!mass) return;
  await db.mass.update({ where: { id }, data: { geprueft: !mass.geprueft } });
  revalidatePath(seiteVon(mass));
}

// Kopiert Maße aus der Bibliothek in einen Auftrag. Bewusst eine Kopie:
// spätere Änderungen in der Bibliothek verändern bestehende Aufträge nicht.
export async function masseUebernehmen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const bibliothekseintragId = Number(formData.get("bibliothekseintragId"));
  const auftragId = Number(formData.get("auftragId"));
  const variante = String(formData.get("variante") ?? "");
  if (!auftragId) return;

  const quelle = await db.mass.findMany({
    where: { bibliothekseintragId, ...(variante ? { variante } : {}) },
    orderBy: { reihenfolge: "asc" },
    include: { bibliothekseintrag: { select: { titel: true } } },
  });
  const letztes = await db.mass.findFirst({
    where: { auftragId },
    orderBy: { reihenfolge: "desc" },
    select: { reihenfolge: true },
  });
  const start = letztes?.reihenfolge ?? 0;

  await db.mass.createMany({
    data: quelle.map((m, i) => ({
      auftragId,
      bezeichnung: [m.variante, m.bezeichnung].filter(Boolean).join(" · "),
      wert: m.wert,
      einheit: m.einheit,
      notiz: m.notiz ?? `aus Bibliothek: ${m.bibliothekseintrag?.titel ?? ""}`,
      reihenfolge: start + i + 1,
    })),
  });

  revalidatePath(`/auftraege/${auftragId}`);
  redirect(`/auftraege/${auftragId}`);
}
