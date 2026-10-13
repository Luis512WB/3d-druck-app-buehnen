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
    <Karte className="divide-y divide-linie">
      {drucker.map((d) => {
        const belegt = d.druckjobs.length > 0;
        return (
          <div key={d.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <div className="font-medium">{d.name}</div>
              <div className="text-sm text-gedaempft tabular-nums">
                {d.bauraumXMm} × {d.bauraumYMm} × {d.bauraumZMm} mm
                {d.anzahlMaterialien > 1 && ` · ${d.anzahlMaterialien} Materialien gleichzeitig`}
              </div>
              {d.druckjobs.map((j) => (
                <Link key={j.id} href={`/auftraege/${j.auftrag.id}`} className="mt-1 block truncate text-sm text-akzent">
                  druckt {j.auftrag.nummer} · {j.auftrag.titel}
                </Link>
              ))}
            </div>
            {d.zustand !== "BEREIT" ? (
              <Chip farbe="#f59e0b">{DRUCKER_ZUSTAND[d.zustand as DruckerZustand] ?? d.zustand}</Chip>
            ) : belegt ? (
              <Chip farbe="#2563eb">Druckt</Chip>
            ) : (
              <Chip farbe="#16a34a">Frei</Chip>
            )}
          </div>
        );
      })}
    </Karte>
  );
}
