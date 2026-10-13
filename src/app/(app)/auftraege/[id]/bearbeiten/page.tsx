import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuftragFormular } from "@/components/auftraege/auftrag-formular";
import { Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Auftrag bearbeiten" };

export default async function AuftragBearbeiten({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const auftrag = await db.auftrag.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!auftrag) notFound();

  // Archivierte Stücke und ausgeblendete Abteilungen bleiben wählbar, wenn der Auftrag sie schon nutzt.
  const [stuecke, abteilungen, drucker, laufend] = await Promise.all([
    db.stueck.findMany({
      where: { OR: [{ status: { not: "ARCHIVIERT" } }, { id: auftrag.stueckId ?? 0 }] },
      orderBy: { titel: "asc" },
    }),
    db.abteilung.findMany({
      where: { OR: [{ aktiv: true }, { id: auftrag.abteilungId ?? 0 }] },
      orderBy: { name: "asc" },
    }),
    db.drucker.findMany({
      where: { zustand: { not: "AUSSER_BETRIEB" } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, zustand: true },
    }),
    db.druckjob.findFirst({ where: { auftragId: auftrag.id, status: "LAEUFT" } }),
  ]);

  return (
    <>
      <Seitenkopf titel="Auftrag bearbeiten" text={`${auftrag.nummer} · ${auftrag.titel}`} />
      <AuftragFormular
        auftrag={auftrag}
        stuecke={stuecke.map((s) => ({ id: s.id, name: s.titel }))}
        abteilungen={abteilungen.map((a) => ({ id: a.id, name: a.name }))}
        drucker={drucker}
        druckerId={laufend?.druckerId}
      />
    </>
  );
}
