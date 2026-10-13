import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIORITAET_RANG } from "@/lib/format";
import { ABGESCHLOSSENE_STATUS } from "@/lib/werte";
import { AUFTRAG_FUER_LISTE, AuftragsListe } from "@/components/auftraege/auftrags-liste";
import { DruckerListe } from "@/components/drucker-liste";
import { Abschnitt, KNOPF } from "@/components/ui/formular";
import { Karte, Leerzustand, Seitenkopf } from "@/components/ui/seite";

export default async function Uebersicht() {
  const benutzer = await erfordereBenutzer();

  const [offene, stuecke, eintraege, drucker] = await Promise.all([
    db.auftrag.findMany({ where: { status: { notIn: ABGESCHLOSSENE_STATUS } }, include: AUFTRAG_FUER_LISTE }),
    db.stueck.count({ where: { status: { not: "ARCHIVIERT" } } }),
    db.bibliothekseintrag.count(),
    db.drucker.findMany({ orderBy: { name: "asc" } }),
  ]);

  // Wichtigstes zuerst: Priorität, dann Deadline.
  offene.sort(
    (a, b) =>
      PRIORITAET_RANG[a.prioritaet] - PRIORITAET_RANG[b.prioritaet] ||
      (a.faelligAm?.getTime() ?? Infinity) - (b.faelligAm?.getTime() ?? Infinity),
  );

  const kacheln = [
    { href: "/auftraege", zahl: offene.length, name: "Offene Aufträge" },
    { href: "/stuecke", zahl: stuecke, name: "Stücke" },
    { href: "/bibliothek", zahl: eintraege, name: "Einträge in der Maßbibliothek" },
  ];

  return (
    <>
      <Seitenkopf
        titel={`Hallo ${benutzer.name}`}
        aktion={
          <Link href="/auftraege/neu" className={KNOPF}>
            Neuer Auftrag
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {kacheln.map((k) => (
          <Link key={k.href} href={k.href}>
            <Karte className="h-full p-4 transition-colors hover:border-akzent">
              <div className="text-2xl font-semibold tabular-nums sm:text-3xl">{k.zahl}</div>
              <div className="mt-1 text-xs text-gedaempft sm:text-sm">{k.name}</div>
            </Karte>
          </Link>
        ))}
      </div>

      <Abschnitt
        titel="Als Nächstes"
        aktion={
          offene.length > 6 && (
            <Link href="/auftraege" className="text-sm text-gedaempft underline">
              Alle {offene.length} anzeigen
            </Link>
          )
        }
      >
        {offene.length === 0 ? (
          <Leerzustand titel="Keine offenen Aufträge" text="Lege ein Stück an und erfasse den ersten Auftrag dazu." />
        ) : (
          <AuftragsListe auftraege={offene.slice(0, 6)} />
        )}
      </Abschnitt>

      <Abschnitt titel="Drucker">
        <DruckerListe drucker={drucker} />
      </Abschnitt>
    </>
  );
}
