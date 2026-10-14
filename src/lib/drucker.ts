import { db } from "./db";
import type { DruckerAuswahl } from "@/components/auftraege/status-auswahl";

// Drucker für die Statusauswahl, samt der Aufträge, die gerade darauf laufen.
export async function druckerFuerAuswahl(): Promise<DruckerAuswahl[]> {
  const drucker = await db.drucker.findMany({
    where: { zustand: { not: "AUSSER_BETRIEB" } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      zustand: true,
      druckjobs: { where: { status: "LAEUFT" }, select: { auftrag: { select: { nummer: true } } } },
    },
  });
  return drucker.map(({ druckjobs, ...d }) => ({ ...d, belegtDurch: druckjobs.map((j) => j.auftrag.nummer) }));
}
