import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { DRUCKER_ZUSTAND, type DruckerZustand } from "@/lib/werte";
import { Chip, Karte } from "@/components/ui/seite";

// Abfrage-Baustein: Drucker samt dem Auftrag, der gerade darauf läuft.
export const DRUCKER_MIT_LAUFENDEM_JOB = {
  druckjobs: {
    where: { status: "LAEUFT" },
    orderBy: { startTatsaechlich: "desc" },
    select: { id: true, auftrag: { select: { id: true, nummer: true, titel: true } } },
  },
} satisfies Prisma.DruckerInclude;

type DruckerMitJob = Prisma.DruckerGetPayload<{ include: typeof DRUCKER_MIT_LAUFENDEM_JOB }>;

export function DruckerListe({ drucker }: { drucker: DruckerMitJob[] }) {
  return (
    <Karte className="divide-y divide-linie-2">
      {drucker.map((d) => {
        const belegt = d.druckjobs.length > 0;
        return (
          <div key={d.id} className="space-y-2 px-4 py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-semibold">{d.name}</div>
                <div className="truncate font-mono text-xs text-gedaempft">
                  {d.bauraumXMm} × {d.bauraumYMm} × {d.bauraumZMm} mm
                  {d.anzahlMaterialien > 1 && ` · ${d.anzahlMaterialien} Materialien`}
                </div>
              </div>
              {d.zustand !== "BEREIT" ? (
                <Chip farbe="#c9a227">{DRUCKER_ZUSTAND[d.zustand as DruckerZustand] ?? d.zustand}</Chip>
              ) : belegt ? (
                <Chip farbe="var(--akzent)">Druckt</Chip>
              ) : (
                <Chip farbe="#5f9e6e">Frei</Chip>
              )}
            </div>
            {belegt ? (
              d.druckjobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/auftraege/${j.auftrag.id}`}
                  className="flex items-center gap-2 border-l-2 border-akzent bg-akzent-zart px-3 py-2 text-sm"
                >
                  <span className="font-mono font-semibold">{j.auftrag.nummer}</span>
                  <span className="truncate">{j.auftrag.titel}</span>
                </Link>
              ))
            ) : (
              <div className="border-l-2 border-linie bg-flaeche-2 px-3 py-2 text-sm text-gedaempft">
                Bereit für den nächsten Druck
              </div>
            )}
          </div>
        );
      })}
    </Karte>
  );
}
