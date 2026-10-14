import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { druckerFuerAuswahl } from "@/lib/drucker";
import { PRIORITAET_FARBE, datum, farbeZuHex, gramm, istUeberfaellig } from "@/lib/format";
import { PRIORITAETEN, type Prioritaet } from "@/lib/werte";
import { Chip, Karte, Merkmal } from "@/components/ui/seite";
import { StatusAuswahl } from "./status-auswahl";

// Abfrage-Baustein, damit jede Liste dieselben Zusatzdaten lädt.
export const AUFTRAG_FUER_LISTE = {
  stueck: { select: { titel: true } },
  abteilung: { select: { name: true, farbeHex: true } },
  anhaenge: { where: { art: "BILD", vorschauPfad: { not: null } }, take: 1, orderBy: { id: "asc" }, select: { id: true } },
  druckjobs: { where: { status: "LAEUFT" }, take: 1, select: { druckerId: true } },
} satisfies Prisma.AuftragInclude;

type AuftragInListe = Prisma.AuftragGetPayload<{ include: typeof AUFTRAG_FUER_LISTE }>;

// Die ganze Zeile öffnet den Auftrag; der Status lässt sich direkt in der Zeile ändern.
export async function AuftragsListe({ auftraege, ohneStueck }: { auftraege: AuftragInListe[]; ohneStueck?: boolean }) {
  const drucker = await druckerFuerAuswahl();

  return (
    <Karte className="divide-y divide-linie-2">
      {auftraege.map((a) => {
        const bild = a.anhaenge[0];
        const ueberfaellig = istUeberfaellig(a.faelligAm, a.status);
        const meta = [ohneStueck ? null : (a.stueck?.titel ?? "Allgemein"), a.abteilung?.name].filter(Boolean).join(" · ");
        return (
          <div key={a.id} className="relative flex gap-3 px-4 py-3 hover:bg-flaeche-2">
            <Link href={`/auftraege/${a.id}`} className="absolute inset-0" aria-label={`${a.titel} öffnen`} />
            <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[4px] border border-linie-2 bg-flaeche-2 font-mono text-[10px] text-gedaempft-2">
              {bild ? (
                // eslint-disable-next-line @next/next/no-img-element -- Bilder kommen aus der geschützten Datei-Route
                <img src={`/api/dateien/${bild.id}?g=mini`} alt="" className="size-full object-cover" loading="lazy" />
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12 4 7.5" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-semibold">{a.titel}</span>
                <span className="shrink-0 font-mono text-xs text-gedaempft">{a.nummer}</span>
              </div>
              <div className="truncate text-[13px] text-gedaempft">
                {meta}
                {meta && a.faelligAm && " · "}
                {a.faelligAm && (
                  <span className={ueberfaellig ? "font-semibold text-warnung" : ""}>
                    {ueberfaellig ? "überfällig seit " : "bis "}
                    {datum(a.faelligAm)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusAuswahl
                  auftragId={a.id}
                  bezeichnung={`${a.nummer} · ${a.titel}`}
                  status={a.status}
                  druckerId={a.druckjobs[0]?.druckerId ?? null}
                  drucker={drucker}
                />
                {a.prioritaet !== "MITTEL" && (
                  <Chip farbe={PRIORITAET_FARBE[a.prioritaet]}>
                    {PRIORITAETEN[a.prioritaet as Prioritaet] ?? a.prioritaet}
                  </Chip>
                )}
                {(a.material || a.farbe) && (
                  <Merkmal farbe={farbeZuHex(a.farbe)}>{[a.material, a.farbe].filter(Boolean).join(" · ")}</Merkmal>
                )}
                {a.filamentGeschaetztG != null && <Merkmal>{gramm(a.filamentGeschaetztG)}</Merkmal>}
              </div>
            </div>
          </div>
        );
      })}
    </Karte>
  );
}
