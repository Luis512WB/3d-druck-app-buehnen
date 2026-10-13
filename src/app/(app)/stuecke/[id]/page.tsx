import Link from "next/link";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIORITAET_RANG, datum, dauer, gramm } from "@/lib/format";
import { ABGESCHLOSSENE_STATUS, STUECK_STATUS } from "@/lib/werte";
import { AnhangBereich } from "@/components/anhaenge/anhang-bereich";
import { AUFTRAG_FUER_LISTE, AuftragsListe } from "@/components/auftraege/auftrags-liste";
import { Abschnitt, KNOPF, KNOPF_KLEIN } from "@/components/ui/formular";
import { Karte, Leerzustand, Seitenkopf } from "@/components/ui/seite";

export default async function StueckDetail({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer();
  const stueck = await db.stueck.findUnique({
    where: { id: Number((await params).id) || 0 },
    include: {
      anhaenge: { orderBy: { id: "asc" } },
      auftraege: { include: AUFTRAG_FUER_LISTE },
    },
  });
  if (!stueck) notFound();

  const abgeschlossen = (status: string) => (ABGESCHLOSSENE_STATUS as string[]).includes(status);
  const auftraege = stueck.auftraege.sort(
    (a, b) =>
      Number(abgeschlossen(a.status)) - Number(abgeschlossen(b.status)) ||
      PRIORITAET_RANG[a.prioritaet] - PRIORITAET_RANG[b.prioritaet] ||
      (a.faelligAm?.getTime() ?? Infinity) - (b.faelligAm?.getTime() ?? Infinity),
  );

  // Ist-Wert, wenn vorhanden, sonst die Schätzung – so stimmt die Summe auch bei laufenden Aufträgen ungefähr.
  const filament = auftraege.reduce((s, a) => s + (a.filamentTatsaechlichG ?? a.filamentGeschaetztG ?? 0), 0);
  const minuten = auftraege.reduce((s, a) => s + (a.druckzeitTatsaechlichMin ?? a.druckzeitGeschaetztMin ?? 0), 0);

  const eckdaten = [
    ["Sparte", stueck.sparte],
    ["Spielzeit", stueck.spielzeit],
    ["Premiere", stueck.premiere ? datum(stueck.premiere) : null],
    ["Spielstätte", stueck.spielstaette],
    ["Ansprechpersonen", stueck.ansprechpersonen],
    ["Status", STUECK_STATUS[stueck.status as keyof typeof STUECK_STATUS] ?? stueck.status],
  ].filter(([, wert]) => wert);

  return (
    <>
      <Seitenkopf
        titel={stueck.titel}
        aktion={
          <Link href={`/stuecke/${stueck.id}/bearbeiten`} className={KNOPF_KLEIN}>
            Bearbeiten
          </Link>
        }
      />

      <Karte className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-sm sm:grid-cols-3">
        {eckdaten.map(([name, wert]) => (
          <div key={name}>
            <div className="text-gedaempft">{name}</div>
            <div>{wert}</div>
          </div>
        ))}
        <div>
          <div className="text-gedaempft">Filament gesamt</div>
          <div className="tabular-nums">{gramm(filament)}</div>
        </div>
        <div>
          <div className="text-gedaempft">Druckzeit gesamt</div>
          <div className="tabular-nums">{dauer(minuten)}</div>
        </div>
        {stueck.notizen && <p className="col-span-full whitespace-pre-wrap border-t border-linie pt-3">{stueck.notizen}</p>}
      </Karte>

      <Abschnitt
        titel={`Aufträge (${auftraege.length})`}
        aktion={
          <Link href={`/auftraege/neu?stueck=${stueck.id}`} className={KNOPF}>
            Neuer Auftrag
          </Link>
        }
      >
        {auftraege.length === 0 ? (
          <Leerzustand titel="Noch keine Aufträge" text="Lege den ersten Auftrag für dieses Stück an." />
        ) : (
          <AuftragsListe auftraege={auftraege} ohneStueck />
        )}
      </Abschnitt>

      <Abschnitt titel="Bilder und Dateien zum Stück">
        <AnhangBereich anhaenge={stueck.anhaenge} stueckId={stueck.id} />
      </Abschnitt>
    </>
  );
}
