"use server";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuftragSchema, ersterFehler } from "@/lib/schemas";
import type { FormZustand } from "@/lib/typen";
import { dateienLoeschen } from "@/lib/uploads";
import { ABGESCHLOSSENE_STATUS, AUFTRAG_STATUS, type AuftragStatus } from "@/lib/werte";

const stunden = (h: number | null) => (h == null ? null : Math.round(h * 60));
const abgeschlossen = (status: string) => (ABGESCHLOSSENE_STATUS as string[]).includes(status);

// Die Nummer (WB-12) leitet sich aus der Datenbank-ID ab und steht deshalb erst nach dem Anlegen fest.
async function mitNummerAnlegen(daten: Omit<Prisma.AuftragUncheckedCreateInput, "nummer">) {
  return db.$transaction(async (tx) => {
    const neu = await tx.auftrag.create({ data: { ...daten, nummer: `neu-${randomUUID()}` } });
    return tx.auftrag.update({ where: { id: neu.id }, data: { nummer: `WB-${neu.id}` } });
  });
}

// "Im Druck" gehört immer zu genau einem Drucker. Festgehalten wird das als laufender Druckjob,
// damit die Druckerplanung (Phase 2) auf denselben Daten aufbaut.
const NACH_DEM_DRUCK = ["NACHBEARBEITUNG", "FERTIG", "GELIEFERT"];

async function druckerPruefen(auftragId: number | null, status: string, druckerId: number | null) {
  if (status !== "IM_DRUCK") return null;
  if (druckerId) {
    return (await db.drucker.findUnique({ where: { id: druckerId } })) ? null : "Drucker nicht gefunden.";
  }
  const laeuft = auftragId ? await db.druckjob.findFirst({ where: { auftragId, status: "LAEUFT" } }) : null;
  return laeuft ? null : "Bitte den Drucker auswählen, auf dem gedruckt wird.";
}

async function druckjobAbgleichen(auftragId: number, vorher: string | null, status: string, druckerId: number | null) {
  if (status === "IM_DRUCK") {
    const laeuft = await db.druckjob.findFirst({ where: { auftragId, status: "LAEUFT" } });
    if (!laeuft && druckerId) {
      await db.druckjob.create({ data: { auftragId, druckerId, status: "LAEUFT", startTatsaechlich: new Date() } });
    } else if (laeuft && druckerId && laeuft.druckerId !== druckerId) {
      await db.druckjob.update({ where: { id: laeuft.id }, data: { druckerId } });
    }
  } else if (vorher === "IM_DRUCK") {
    // Weiter im Ablauf = Druck gelungen; zurück, pausiert oder abgebrochen = Druck nicht zu Ende geführt.
    await db.druckjob.updateMany({
      where: { auftragId, status: "LAEUFT" },
      data: { status: NACH_DEM_DRUCK.includes(status) ? "ERFOLGREICH" : "ABGESAGT", endeTatsaechlich: new Date() },
    });
  }
}

export async function auftragSpeichern(_: FormZustand, formData: FormData): Promise<FormZustand> {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");

  const eingabe = AuftragSchema.safeParse(Object.fromEntries(formData));
  if (!eingabe.success) return { fehler: ersterFehler(eingabe.error) };

  const { id, druckerId, druckzeitGeschaetztH, druckzeitTatsaechlichH, erhaltenAm, stueckzahl, ...rest } = eingabe.data;
  const druckerFehler = await druckerPruefen(id, rest.status, druckerId);
  if (druckerFehler) return { fehler: druckerFehler };
  const daten = {
    ...rest,
    stueckzahl: stueckzahl ?? 1,
    erhaltenAm: erhaltenAm ?? new Date(),
    druckzeitGeschaetztMin: stunden(druckzeitGeschaetztH),
    druckzeitTatsaechlichMin: stunden(druckzeitTatsaechlichH),
  };

  let auftragId: number;
  if (id) {
    const vorher = await db.auftrag.findUnique({ where: { id }, select: { status: true, abgeschlossenAm: true } });
    if (!vorher) return { fehler: "Auftrag nicht gefunden." };
    await db.auftrag.update({
      where: { id },
      data: {
        ...daten,
        abgeschlossenAm: abgeschlossen(daten.status) ? (vorher.abgeschlossenAm ?? new Date()) : null,
      },
    });
    auftragId = id;
    await druckjobAbgleichen(id, vorher.status, daten.status, druckerId);
  } else {
    const neu = await mitNummerAnlegen({
      ...daten,
      erstelltVonId: benutzer.id,
      abgeschlossenAm: abgeschlossen(daten.status) ? new Date() : null,
    });
    auftragId = neu.id;
    await druckjobAbgleichen(neu.id, null, daten.status, druckerId);
  }

  revalidatePath("/", "layout");
  redirect(`/auftraege/${auftragId}`);
}

export async function statusAendern(_: FormZustand, formData: FormData): Promise<FormZustand> {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  const druckerId = Number(formData.get("druckerId")) || null;
  if (!(status in AUFTRAG_STATUS)) return { fehler: "Ungültiger Status." };

  const vorher = await db.auftrag.findUnique({ where: { id }, select: { status: true, abgeschlossenAm: true } });
  if (!vorher) return { fehler: "Auftrag nicht gefunden." };

  const druckerFehler = await druckerPruefen(id, status, druckerId);
  if (druckerFehler) return { fehler: druckerFehler };

  await druckjobAbgleichen(id, vorher.status, status, druckerId);

  if (vorher.status !== status) {
    const drucker = status === "IM_DRUCK" && druckerId ? await db.drucker.findUnique({ where: { id: druckerId } }) : null;
    const von = AUFTRAG_STATUS[vorher.status as AuftragStatus] ?? vorher.status;
    const nach = AUFTRAG_STATUS[status as AuftragStatus] + (drucker ? ` (${drucker.name})` : "");
    await db.auftrag.update({
      where: { id },
      data: {
        status,
        abgeschlossenAm: abgeschlossen(status) ? (vorher.abgeschlossenAm ?? new Date()) : null,
        notizen: { create: { art: "STATUSWECHSEL", autorId: benutzer.id, text: `${von} → ${nach}` } },
      },
    });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function auftragDuplizieren(formData: FormData) {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");
  const vorlage = await db.auftrag.findUnique({
    where: { id: Number(formData.get("id")) },
    include: { masse: true },
  });
  if (!vorlage) return;

  // Übernommen wird die Beschreibung des Teils, nicht der Verlauf (Status, Ist-Werte, Bilder, Notizen).
  const kopie = await mitNummerAnlegen({
    titel: `${vorlage.titel} (Kopie)`,
    beschreibung: vorlage.beschreibung,
    stueckId: vorlage.stueckId,
    abteilungId: vorlage.abteilungId,
    ansprechperson: vorlage.ansprechperson,
    umfang: vorlage.umfang,
    prioritaet: vorlage.prioritaet,
    stueckzahl: vorlage.stueckzahl,
    material: vorlage.material,
    farbe: vorlage.farbe,
    filamentGeschaetztG: vorlage.filamentGeschaetztG,
    druckzeitGeschaetztMin: vorlage.druckzeitGeschaetztMin,
    laengeMm: vorlage.laengeMm,
    breiteMm: vorlage.breiteMm,
    hoeheMm: vorlage.hoeheMm,
    nachbearbeitung: vorlage.nachbearbeitung,
    erstelltVonId: benutzer.id,
    masse: {
      create: vorlage.masse.map((m) => ({
        bezeichnung: m.bezeichnung,
        wert: m.wert,
        einheit: m.einheit,
        notiz: m.notiz,
        reihenfolge: m.reihenfolge,
      })),
    },
  });

  revalidatePath("/", "layout");
  redirect(`/auftraege/${kopie.id}`);
}

export async function auftragLoeschen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const id = Number(formData.get("id"));
  const anhaenge = await db.anhang.findMany({ where: { auftragId: id } });

  await db.auftrag.delete({ where: { id } });
  await Promise.all(anhaenge.map(dateienLoeschen));

  revalidatePath("/", "layout");
  redirect("/auftraege");
}

export async function notizHinzufuegen(formData: FormData) {
  const benutzer = await erfordereBenutzer("ADMIN", "BEARBEITER");
  const auftragId = Number(formData.get("auftragId"));
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;

  await db.notiz.create({ data: { auftragId, text, autorId: benutzer.id } });
  revalidatePath(`/auftraege/${auftragId}`);
}

export async function notizLoeschen(formData: FormData) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const notiz = await db.notiz.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath(`/auftraege/${notiz.auftragId}`);
}
