import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIORITAET_RANG, istUeberfaellig } from "@/lib/format";
import { ABGESCHLOSSENE_STATUS } from "@/lib/werte";
import { AUFTRAG_FUER_LISTE, AuftragsListe } from "@/components/auftraege/auftrags-liste";
import { DRUCKER_MIT_LAUFENDEM_JOB, DruckerListe } from "@/components/drucker-liste";
import { Abschnitt, KNOPF } from "@/components/ui/formular";
import { Karte, Leerzustand, Seitenkopf } from "@/components/ui/seite";

export default async function Uebersicht() {
  const benutzer = await erfordereBenutzer();

  const [offene, stuecke, eintraege, drucker] = await Promise.all([
    db.auftrag.findMany({ where: { status: { notIn: ABGESCHLOSSENE_STATUS } }, include: AUFTRAG_FUER_LISTE }),
    db.stueck.count({ where: { status: { not: "ARCHIVIERT" } } }),
    db.bibliothekseintrag.count(),
    db.drucker.findMany({ orderBy: { name: "asc" }, include: DRUCKER_MIT_LAUFENDEM_JOB }),
  ]);

  // Wichtigstes zuerst: Priorität, dann Deadline.
  offene.sort(
    (a, b) =>
      PRIORITAET_RANG[a.prioritaet] - PRIORITAET_RANG[b.prioritaet] ||
      (a.faelligAm?.getTime() ?? Infinity) - (b.faelligAm?.getTime() ?? Infinity),
  );

  const imDruck = offene.filter((a) => a.status === "IM_DRUCK").length;
  const ueberfaellig = offene.filter((a) => istUeberfaellig(a.faelligAm, a.status)).length;
  // Farbe nur, wenn sie etwas bedeutet: laufende Drucke und Überfälliges.
  const kacheln = [
    { href: "/auftraege", zahl: offene.length, name: "Offene Aufträge", farbe: "" },
    { href: "/auftraege?status=IM_DRUCK", zahl: imDruck, name: "Im Druck", farbe: imDruck ? "text-akzent" : "" },
    { href: "/auftraege", zahl: ueberfaellig, name: "Überfällig", farbe: ueberfaellig ? "text-warnung" : "" },
    { href: "/bibliothek", zahl: eintraege, name: "Maßbibliothek", farbe: "" },
  ];
  const heute = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return (
    <>
      <Seitenkopf
        titel={`Hallo ${benutzer.name}`}
        text={`${heute} · ${stuecke} ${stuecke === 1 ? "Stück" : "Stücke"} in Arbeit`}
        aktion={
          <Link href="/auftraege/neu" className={KNOPF}>
            Neuer Auftrag
          </Link>
        }
      />

      <Karte className="grid grid-cols-2 overflow-hidden sm:grid-cols-4">
        {kacheln.map((k, i) => (
          <Link
            key={k.name}
            href={k.href}
            className={`border-linie-2 px-4 py-3.5 hover:bg-flaeche-2 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
          >
            <div className={`font-mono text-3xl font-semibold leading-tight ${k.farbe}`}>{k.zahl}</div>
            <div className="text-xs font-medium text-gedaempft">{k.name}</div>
          </Link>
        ))}
      </Karte>

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
