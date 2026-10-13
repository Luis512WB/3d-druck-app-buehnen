const DATUM = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
const DATUM_ZEIT = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const ZAHL = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
const STUNDEN = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export const datum = (d: Date | null | undefined) => (d ? DATUM.format(d) : "–");
export const datumZeit = (d: Date) => DATUM_ZEIT.format(d);
export const zahl = (n: number | null | undefined) => (n == null ? "–" : ZAHL.format(n));
export const gramm = (n: number | null | undefined) => (n == null ? "–" : `${ZAHL.format(n)} g`);

// Gespeichert wird in Minuten, angezeigt in Stunden (z. B. 4,2 h).
export const dauer = (min: number | null | undefined) => (min == null ? "–" : `${STUNDEN.format(min / 60)} h`);

export const stundenFuerEingabe = (min: number | null | undefined) =>
  min == null ? "" : String(Math.round((min / 60) * 100) / 100).replace(".", ",");

export const zahlFuerEingabe = (n: number | null | undefined) => (n == null ? "" : String(n).replace(".", ","));

// Wert für <input type="date">
export const datumFuerEingabe = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

export function groesse(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${ZAHL.format(bytes / 1024 / 1024)} MB`;
}

export function istUeberfaellig(faelligAm: Date | null, status: string) {
  if (!faelligAm || ["FERTIG", "GELIEFERT", "ABGEBROCHEN"].includes(status)) return false;
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return faelligAm < heute;
}

// Farbpunkt neben der Filamentfarbe: einfache Zuordnung über den Namen.
const FARBEN: [string, string][] = [
  ["schwarz", "#111111"],
  ["weiß", "#f5f5f5"],
  ["weiss", "#f5f5f5"],
  ["grau", "#9ca3af"],
  ["silber", "#c0c0c0"],
  ["rot", "#dc2626"],
  ["orange", "#f97316"],
  ["gelb", "#facc15"],
  ["grün", "#16a34a"],
  ["blau", "#2563eb"],
  ["lila", "#7c3aed"],
  ["violett", "#7c3aed"],
  ["pink", "#ec4899"],
  ["braun", "#92400e"],
  ["gold", "#d4af37"],
  ["transparent", "#e5e7eb"],
  ["natur", "#e8dcc4"],
];

export function farbeZuHex(name: string | null | undefined) {
  if (!name) return null;
  const n = name.toLowerCase();
  return FARBEN.find(([wort]) => n.includes(wort))?.[1] ?? null;
}

export const PRIORITAET_FARBE: Record<string, string> = {
  NIEDRIG: "#9ca3af",
  MITTEL: "#3b82f6",
  HOCH: "#f97316",
  DRINGEND: "#ef4444",
};

export const PRIORITAET_RANG: Record<string, number> = { DRINGEND: 0, HOCH: 1, MITTEL: 2, NIEDRIG: 3 };

export function statusFarbe(status: string) {
  if (status === "IM_DRUCK") return "#2563eb";
  if (status === "FERTIG" || status === "GELIEFERT") return "#16a34a";
  if (status === "PAUSIERT" || status === "ABGEBROCHEN") return "#9ca3af";
  return "#f59e0b";
}
