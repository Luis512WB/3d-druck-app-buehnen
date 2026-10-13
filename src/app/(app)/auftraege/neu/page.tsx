import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuftragFormular } from "@/components/auftraege/auftrag-formular";
import { Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Neuer Auftrag" };

export default async function NeuerAuftrag({ searchParams }: { searchParams: Promise<{ stueck?: string }> }) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const vorauswahl = Number((await searchParams).stueck) || undefined;

  const [stuecke, abteilungen] = await Promise.all([
    db.stueck.findMany({ where: { status: { not: "ARCHIVIERT" } }, orderBy: { titel: "asc" } }),
    db.abteilung.findMany({ where: { aktiv: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <Seitenkopf titel="Neuer Auftrag" text="Nur der Titel ist Pflicht – Fotos und Maße kommen im nächsten Schritt." />
      <AuftragFormular
        stuecke={stuecke.map((s) => ({ id: s.id, name: s.titel }))}
        abteilungen={abteilungen.map((a) => ({ id: a.id, name: a.name }))}
        stueckVorauswahl={vorauswahl}
      />
    </>
  );
}
