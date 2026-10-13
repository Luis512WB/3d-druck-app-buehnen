import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIORITAET_RANG } from "@/lib/format";
import { ABGESCHLOSSENE_STATUS, AUFTRAG_STATUS, PRIORITAETEN } from "@/lib/werte";
import { AUFTRAG_FUER_LISTE, AuftragsListe } from "@/components/auftraege/auftrags-liste";
import { EINGABE, KNOPF, KNOPF_ZWEIT } from "@/components/ui/formular";
import { AutoAuswahl } from "@/components/ui/knoepfe";
import { Leerzustand, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Aufträge" };

type Filter = { q?: string; status?: string; stueck?: string; abteilung?: string; prioritaet?: string };

export default async function Auftraege({ searchParams }: { searchParams: Promise<Filter> }) {
  await erfordereBenutzer();
  const f = await searchParams;
  const status = f.status ?? "offen";

  const where: Prisma.AuftragWhereInput = {
    ...(status === "offen"
      ? { status: { notIn: ABGESCHLOSSENE_STATUS } }
      : status === "alle"
        ? {}
        : { status }),
    ...(f.stueck === "ohne" ? { stueckId: null } : f.stueck ? { stueckId: Number(f.stueck) } : {}),
    ...(f.abteilung ? { abteilungId: Number(f.abteilung) } : {}),
    ...(f.prioritaet ? { prioritaet: f.prioritaet } : {}),
    ...(f.q
      ? {
          OR: [
            { titel: { contains: f.q } },
            { nummer: { contains: f.q } },
            { beschreibung: { contains: f.q } },
            { ansprechperson: { contains: f.q } },
            { farbe: { contains: f.q } },
          ],
        }
      : {}),
  };

  const [auftraege, stuecke, abteilungen] = await Promise.all([
    db.auftrag.findMany({ where, include: AUFTRAG_FUER_LISTE }),
    db.stueck.findMany({ orderBy: { titel: "asc" }, select: { id: true, titel: true } }),
    db.abteilung.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  auftraege.sort(
    (a, b) =>
      PRIORITAET_RANG[a.prioritaet] - PRIORITAET_RANG[b.prioritaet] ||
      (a.faelligAm?.getTime() ?? Infinity) - (b.faelligAm?.getTime() ?? Infinity) ||
      b.id - a.id,
  );

  const gefiltert = Boolean(f.q || f.stueck || f.abteilung || f.prioritaet || (f.status && f.status !== "offen"));

  return (
    <>
      <Seitenkopf
        titel="Aufträge"
        text={`${auftraege.length} ${auftraege.length === 1 ? "Auftrag" : "Aufträge"}`}
        aktion={
          <Link href="/auftraege/neu" className={KNOPF}>
            Neuer Auftrag
          </Link>
        }
      />

      <form action="/auftraege" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
        <input
          name="q"
          type="search"
          defaultValue={f.q}
          placeholder="Suchen …"
          aria-label="Suchen"
          className={`${EINGABE} col-span-2`}
        />
        <AutoAuswahl name="status" defaultValue={status} aria-label="Status" className={EINGABE}>
          <option value="offen">Offene</option>
          <option value="alle">Alle</option>
          {Object.entries(AUFTRAG_STATUS).map(([wert, name]) => (
            <option key={wert} value={wert}>
              {name}
            </option>
          ))}
        </AutoAuswahl>
        <AutoAuswahl name="stueck" defaultValue={f.stueck ?? ""} aria-label="Stück" className={EINGABE}>
          <option value="">Alle Stücke</option>
          <option value="ohne">Allgemein</option>
          {stuecke.map((s) => (
            <option key={s.id} value={s.id}>
              {s.titel}
            </option>
          ))}
        </AutoAuswahl>
        <AutoAuswahl name="abteilung" defaultValue={f.abteilung ?? ""} aria-label="Abteilung" className={EINGABE}>
          <option value="">Alle Abteilungen</option>
          {abteilungen.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </AutoAuswahl>
        <AutoAuswahl name="prioritaet" defaultValue={f.prioritaet ?? ""} aria-label="Priorität" className={EINGABE}>
          <option value="">Alle Prioritäten</option>
          {Object.entries(PRIORITAETEN).map(([wert, name]) => (
            <option key={wert} value={wert}>
              {name}
            </option>
          ))}
        </AutoAuswahl>
        <noscript>
          <button className={KNOPF_ZWEIT}>Filtern</button>
        </noscript>
      </form>

      {auftraege.length === 0 ? (
        <Leerzustand
          titel={gefiltert ? "Nichts gefunden" : "Noch keine offenen Aufträge"}
          text={gefiltert ? "Mit diesen Filtern gibt es keine Aufträge." : "Lege den ersten Auftrag an."}
        />
      ) : (
        <AuftragsListe auftraege={auftraege} />
      )}

      {gefiltert && (
        <p className="mt-4 text-sm">
          <Link href="/auftraege" className="text-gedaempft underline">
            Filter zurücksetzen
          </Link>
        </p>
      )}
    </>
  );
}
