// Erlaubte Werte der Auswahlfelder und ihre Beschriftung in der Oberfläche.
// Fachliche Bedeutung: docs/DATENMODELL.md

export const ROLLEN = {
  ADMIN: "Admin",
  BEARBEITER: "Bearbeiter",
  ANFORDERER: "Anforderer",
} as const;
export type Rolle = keyof typeof ROLLEN;

export const PRIORITAETEN = {
  NIEDRIG: "Niedrig",
  MITTEL: "Mittel",
  HOCH: "Hoch",
  DRINGEND: "Dringend",
} as const;
export type Prioritaet = keyof typeof PRIORITAETEN;

export const AUFTRAG_STATUS = {
  ANGEFRAGT: "Angefragt",
  IN_PLANUNG: "In Planung",
  KONSTRUKTION: "Konstruktion",
  DRUCKBEREIT: "Druckbereit",
  IM_DRUCK: "Im Druck",
  NACHBEARBEITUNG: "Nachbearbeitung",
  FERTIG: "Fertig",
  GELIEFERT: "Geliefert",
  PAUSIERT: "Pausiert",
  ABGEBROCHEN: "Abgebrochen",
} as const;
export type AuftragStatus = keyof typeof AUFTRAG_STATUS;

export const ABGESCHLOSSENE_STATUS: AuftragStatus[] = ["FERTIG", "GELIEFERT", "ABGEBROCHEN"];

export const UMFANG = {
  NUR_DRUCK: "Nur Druck",
  KONSTRUKTION_UND_DRUCK: "Konstruktion + Druck",
} as const;

export const MATERIALIEN = ["PLA", "PETG", "ABS", "ASA", "TPU", "Sonstiges"] as const;

export const STUECK_STATUS = {
  IN_VORBEREITUNG: "In Vorbereitung",
  AKTIV: "Aktiv",
  ABGESPIELT: "Abgespielt",
  ARCHIVIERT: "Archiviert",
} as const;

export const SPARTEN = ["Oper", "Schauspiel", "Tanz", "Konzert", "Sonstiges"] as const;

export const DRUCKER_ZUSTAND = {
  BEREIT: "Bereit",
  WARTUNG: "Wartung",
  DEFEKT: "Defekt",
  AUSSER_BETRIEB: "Außer Betrieb",
} as const;
export type DruckerZustand = keyof typeof DRUCKER_ZUSTAND;

export const DRUCKJOB_STATUS = {
  GEPLANT: "Geplant",
  LAEUFT: "Läuft",
  ERFOLGREICH: "Erfolgreich",
  FEHLGESCHLAGEN: "Fehlgeschlagen",
  ABGESAGT: "Abgesagt",
} as const;
