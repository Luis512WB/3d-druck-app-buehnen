import { zipSync, strToU8 } from "fflate";
import { aktuellerBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { datum, dauer, gramm, zahl } from "@/lib/format";
import { dateiLesen } from "@/lib/uploads";
import { AUFTRAG_STATUS, PRIORITAETEN, type AuftragStatus, type Prioritaet } from "@/lib/werte";

// ZIP mit allen Originaldateien eines Auftrags plus einer Textdatei mit Eckdaten und Maßen –
// gedacht zum Ablegen neben der CAD-Datei.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await aktuellerBenutzer())) return new Response("Nicht angemeldet", { status: 401 });

  const auftrag = await db.auftrag.findUnique({
    where: { id: Number((await params).id) || 0 },
    include: {
      stueck: true,
      abteilung: true,
      masse: { orderBy: { reihenfolge: "asc" } },
      anhaenge: true,
      notizen: { where: { art: "NOTIZ" }, orderBy: { erstelltAm: "asc" } },
    },
  });
  if (!auftrag) return new Response("Nicht gefunden", { status: 404 });

  const zeilen = [
    `${auftrag.nummer} – ${auftrag.titel}`,
    "",
    `Stück: ${auftrag.stueck?.titel ?? "Allgemein"}`,
    `Abteilung: ${auftrag.abteilung?.name ?? "–"}`,
    `Ansprechperson: ${auftrag.ansprechperson ?? "–"}`,
    `Priorität: ${PRIORITAETEN[auftrag.prioritaet as Prioritaet] ?? auftrag.prioritaet}`,
    `Status: ${AUFTRAG_STATUS[auftrag.status as AuftragStatus] ?? auftrag.status}`,
    `Deadline: ${datum(auftrag.faelligAm)}`,
    `Anzahl Teile: ${auftrag.stueckzahl}`,
    `Material / Farbe: ${auftrag.material ?? "–"} / ${auftrag.farbe ?? "–"}`,
    `Filament geschätzt: ${gramm(auftrag.filamentGeschaetztG)}`,
    `Druckzeit geschätzt: ${dauer(auftrag.druckzeitGeschaetztMin)}`,
    `Hauptmaße L × B × H: ${zahl(auftrag.laengeMm)} × ${zahl(auftrag.breiteMm)} × ${zahl(auftrag.hoeheMm)} mm`,
    `Nachbearbeitung: ${auftrag.nachbearbeitung ?? "–"}`,
    "",
    "Beschreibung:",
    auftrag.beschreibung ?? "–",
    "",
    "Maße:",
    ...(auftrag.masse.length
      ? auftrag.masse.map((m) => `- ${m.bezeichnung}: ${zahl(m.wert)} ${m.einheit}${m.notiz ? ` (${m.notiz})` : ""}`)
      : ["–"]),
    "",
    "Notizen:",
    ...(auftrag.notizen.length ? auftrag.notizen.map((n) => `- ${datum(n.erstelltAm)}: ${n.text}`) : ["–"]),
  ];

  const inhalt: Record<string, Uint8Array> = { "Auftrag.txt": strToU8(zeilen.join("\r\n")) };
  for (const a of auftrag.anhaenge) {
    try {
      // Die ID im Namen verhindert, dass gleichnamige Dateien einander überschreiben.
      inhalt[`${a.id}-${a.dateiname}`] = new Uint8Array(await dateiLesen(a.pfad));
    } catch {
      // Fehlende Datei überspringen, der Rest soll trotzdem ankommen.
    }
  }

  // Stufe 0: Fotos und CAD-Dateien sind bereits komprimiert.
  const zip = zipSync(inhalt, { level: 0 });
  const name = `${auftrag.nummer} ${auftrag.titel}`.replace(/[\\/:*?"<>|]+/g, "_");

  return new Response(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}.zip`,
    },
  });
}
