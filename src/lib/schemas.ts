import { z } from "zod";
import { AUFTRAG_STATUS, PRIORITAETEN, STUECK_STATUS, UMFANG } from "./werte";

// Formulare liefern immer Strings – leere Felder werden zu null,
// Zahlen dürfen mit Komma eingegeben werden.
const leer = (v: unknown) => v == null || String(v).trim() === "";
const alsZahl = (v: unknown) => Number(String(v).trim().replace(",", "."));

export const text = z.preprocess((v) => (leer(v) ? null : String(v).trim()), z.string().nullable());
export const pflichttext = z.preprocess((v) => String(v ?? "").trim(), z.string().min(1, "Bitte ausfüllen."));
export const zahl = z.preprocess(
  (v) => (leer(v) ? null : alsZahl(v)),
  z.number({ error: "Bitte eine Zahl eingeben." }).min(0).nullable(),
);
export const pflichtzahl = z.preprocess(
  (v) => (leer(v) ? undefined : alsZahl(v)),
  z.number({ error: "Bitte eine Zahl eingeben." }),
);
export const ganzzahl = z.preprocess(
  (v) => (leer(v) ? null : alsZahl(v)),
  z.number({ error: "Bitte eine ganze Zahl eingeben." }).int().min(0).nullable(),
);
export const id = z.preprocess((v) => (leer(v) ? null : Number(v)), z.number().int().positive().nullable());
export const datum = z.preprocess(
  (v) => (leer(v) ? null : new Date(`${String(v)}T12:00:00`)),
  z.date({ error: "Ungültiges Datum." }).nullable(),
);
const haken = z.preprocess((v) => v === "on" || v === "true", z.boolean());
const auswahl = (werte: Record<string, string>) => z.string().refine((v) => v in werte, "Ungültige Auswahl.");

export const StueckSchema = z.object({
  id,
  titel: pflichttext,
  sparte: text,
  spielzeit: text,
  premiere: datum,
  spielstaette: text,
  ansprechpersonen: text,
  notizen: text,
  status: auswahl(STUECK_STATUS),
});

export const AuftragSchema = z.object({
  id,
  titel: pflichttext,
  beschreibung: text,
  stueckId: id,
  abteilungId: id,
  ansprechperson: text,
  umfang: auswahl(UMFANG),
  prioritaet: auswahl(PRIORITAETEN),
  status: auswahl(AUFTRAG_STATUS),
  druckerId: id,
  erhaltenAm: datum,
  faelligAm: datum,
  stueckzahl: ganzzahl,
  material: text,
  farbe: text,
  filamentGeschaetztG: zahl,
  filamentTatsaechlichG: zahl,
  druckzeitGeschaetztH: zahl,
  druckzeitTatsaechlichH: zahl,
  laengeMm: zahl,
  breiteMm: zahl,
  hoeheMm: zahl,
  nachbearbeitung: text,
});

export const MassSchema = z.object({
  auftragId: id,
  bibliothekseintragId: id,
  variante: text,
  geprueft: haken,
  bezeichnung: pflichttext,
  wert: pflichtzahl,
  einheit: z.enum(["mm", "cm", "m", "°"]),
  notiz: text,
});

export const BibliothekSchema = z.object({
  id,
  titel: pflichttext,
  kategorieId: id,
  beschreibung: text,
  druckhinweis: text,
  quelle: text,
  schlagworte: text,
});

const FELDNAMEN: Record<string, string> = {
  titel: "Titel",
  bezeichnung: "Bezeichnung",
  wert: "Wert",
  stueckzahl: "Stückzahl",
  faelligAm: "Deadline",
  erhaltenAm: "Erhalten am",
  premiere: "Premiere",
};

export function ersterFehler(fehler: z.ZodError) {
  const f = fehler.issues[0];
  if (!f) return "Eingabe ungültig.";
  const feld = String(f.path[0] ?? "");
  return `${FELDNAMEN[feld] ?? feld}: ${f.message}`;
}
