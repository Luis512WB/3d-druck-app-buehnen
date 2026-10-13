import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PRIORITAET_FARBE, datum, farbeZuHex, gramm, istUeberfaellig, statusFarbe } from "@/lib/format";
import { AUFTRAG_STATUS, PRIORITAETEN, type AuftragStatus, type Prioritaet } from "@/lib/werte";
import { Chip, Karte } from "@/components/ui/seite";

// Abfrage-Baustein, damit jede Liste dieselben Zusatzdaten lädt.
export const AUFTRAG_FUER_LISTE = {
  stueck: { select: { titel: true } },
  abteilung: { select: { name: true, farbeHex: true } },
  anhaenge: { where: { art: "BILD", vorschauPfad: { not: null } }, take: 1, orderBy: { id: "asc" }, select: { id: true } },
  druckjobs: { where: { status: "LAEUFT" }, take: 1, select: { drucker: { select: { name: true } } } },
} satisfies Prisma.AuftragInclude;

type AuftragInListe = Prisma.AuftragGetPayload<{ include: typeof AUFTRAG_FUER_LISTE }>;

export function AuftragsListe({ auftraege, ohneStueck }: { auftraege: AuftragInListe[]; ohneStueck?: boolean }) {
  return (
    <Karte className="divide-y divide-linie">
      {auftraege.map((a) => {
        const bild = a.anhaenge[0];
        const ueberfaellig = istUeberfaellig(a.faelligAm, a.status);
        return (
          <Link key={a.id} href={`/auftraege/${a.id}`} className="flex gap-3 px-4 py-3 hover:bg-hintergrund">
            <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-linie bg-hintergrund">
              {bild && (
                // eslint-disable-next-line @next/next/no-img-element -- Bilder kommen aus der geschützten Datei-Route
                <img src={`/api/dateien/${bild.id}?g=mini`} alt="" className="size-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-medium">{a.titel}</span>
                <span className="shrink-0 text-xs text-gedaempft tabular-nums">{a.nummer}</span>
              </div>
              <div className="truncate text-sm text-gedaempft">
                {!ohneStueck && (a.stueck?.titel ?? "Allgemein")}
                {!ohneStueck && a.faelligAm && " · "}
                {a.faelligAm && (
                  <span className={ueberfaellig ? "font-medium text-red-600 dark:text-red-400" : ""}>
                    bis {datum(a.faelligAm)}
                    {ueberfaellig && " (überfällig)"}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip farbe={statusFarbe(a.status)}>
                  {AUFTRAG_STATUS[a.status as AuftragStatus] ?? a.status}
                  {a.status === "IM_DRUCK" && a.druckjobs[0] && ` · ${a.druckjobs[0].drucker.name}`}
                </Chip>
                <Chip farbe={PRIORITAET_FARBE[a.prioritaet]}>
                  {PRIORITAETEN[a.prioritaet as Prioritaet] ?? a.prioritaet}
                </Chip>
                {a.abteilung && <Chip farbe={a.abteilung.farbeHex}>{a.abteilung.name}</Chip>}
                {(a.farbe || a.filamentGeschaetztG != null) && (
                  <Chip farbe={farbeZuHex(a.farbe)}>
                    {[a.material, a.farbe, a.filamentGeschaetztG != null ? gramm(a.filamentGeschaetztG) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </Chip>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </Karte>
  );
}
