import Link from "next/link";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PRIORITAET_FARBE,
  datum,
  datumZeit,
  dauer,
  farbeZuHex,
  gramm,
  istUeberfaellig,
  zahl,
} from "@/lib/format";
import { AUFTRAG_STATUS, PRIORITAETEN, UMFANG, type Prioritaet } from "@/lib/werte";
import {
  auftragDuplizieren,
  auftragLoeschen,
  notizHinzufuegen,
  notizLoeschen,
  statusAendern,
} from "@/server/auftraege";
import { AnhangBereich } from "@/components/anhaenge/anhang-bereich";
import { MassBereich } from "@/components/masse/mass-bereich";
import { Abschnitt, EINGABE, KNOPF_KLEIN, KNOPF_ZWEIT, TEXTFELD } from "@/components/ui/formular";
import { AbsendeKnopf, AutoAuswahl, BestaetigenKnopf } from "@/components/ui/knoepfe";
import { Chip, Karte } from "@/components/ui/seite";

export default async function AuftragDetail({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer();
  const auftrag = await db.auftrag.findUnique({
    where: { id: Number((await params).id) || 0 },
    include: {
      stueck: { select: { id: true, titel: true } },
      abteilung: true,
      masse: { orderBy: { reihenfolge: "asc" } },
      anhaenge: { orderBy: { id: "asc" } },
      notizen: { orderBy: { erstelltAm: "desc" }, include: { autor: { select: { name: true } } } },
    },
  });
  if (!auftrag) notFound();
  const a = auftrag;

  const hatHauptmasse = a.laengeMm != null || a.breiteMm != null || a.hoeheMm != null;
  const daten: [string, React.ReactNode][] = [
    ["Abteilung", a.abteilung?.name],
    ["Ansprechperson", a.ansprechperson],
    ["Umfang", UMFANG[a.umfang as keyof typeof UMFANG] ?? a.umfang],
    ["Erhalten am", datum(a.erhaltenAm)],
    [
      "Deadline",
      a.faelligAm && (
        <span className={istUeberfaellig(a.faelligAm, a.status) ? "font-medium text-red-600 dark:text-red-400" : ""}>
          {datum(a.faelligAm)}
        </span>
      ),
    ],
    ["Anzahl Teile", a.stueckzahl],
    ["Material", a.material],
    [
      "Farbe",
      a.farbe && (
        <span className="inline-flex items-center gap-1.5">
          {farbeZuHex(a.farbe) && (
            <span className="size-3 rounded-full border border-linie" style={{ backgroundColor: farbeZuHex(a.farbe)! }} />
          )}
          {a.farbe}
        </span>
      ),
    ],
    ["Filament geschätzt", a.filamentGeschaetztG != null && gramm(a.filamentGeschaetztG)],
    ["Filament tatsächlich", a.filamentTatsaechlichG != null && gramm(a.filamentTatsaechlichG)],
    ["Druckzeit geschätzt", a.druckzeitGeschaetztMin != null && dauer(a.druckzeitGeschaetztMin)],
    ["Druckzeit tatsächlich", a.druckzeitTatsaechlichMin != null && dauer(a.druckzeitTatsaechlichMin)],
    ["Hauptmaße L × B × H", hatHauptmasse && `${zahl(a.laengeMm)} × ${zahl(a.breiteMm)} × ${zahl(a.hoeheMm)} mm`],
    ["Nachbearbeitung", a.nachbearbeitung],
  ];

  return (
    <>
      <header className="mb-6">
        <div className="text-sm text-gedaempft">
          <span className="tabular-nums">{a.nummer}</span>
          {" · "}
          {a.stueck ? (
            <Link href={`/stuecke/${a.stueck.id}`} className="underline">
              {a.stueck.titel}
            </Link>
          ) : (
            "Allgemein"
          )}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{a.titel}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <form action={statusAendern}>
            <input type="hidden" name="id" value={a.id} />
            <AutoAuswahl name="status" defaultValue={a.status} aria-label="Status" className={`${EINGABE} w-auto pr-8`}>
              {Object.entries(AUFTRAG_STATUS).map(([wert, name]) => (
                <option key={wert} value={wert}>
                  {name}
                </option>
              ))}
            </AutoAuswahl>
          </form>
          <Chip farbe={PRIORITAET_FARBE[a.prioritaet]}>
            Priorität {PRIORITAETEN[a.prioritaet as Prioritaet] ?? a.prioritaet}
          </Chip>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          <Link href={`/auftraege/${a.id}/bearbeiten`} className={KNOPF_KLEIN}>
            Bearbeiten
          </Link>
          <a href={`/api/export/auftrag/${a.id}`} className={KNOPF_KLEIN}>
            Alles als ZIP
          </a>
          <form action={auftragDuplizieren}>
            <input type="hidden" name="id" value={a.id} />
            <AbsendeKnopf className={KNOPF_KLEIN}>Duplizieren</AbsendeKnopf>
          </form>
          <form action={auftragLoeschen}>
            <input type="hidden" name="id" value={a.id} />
            <BestaetigenKnopf
              frage={`Auftrag ${a.nummer} mit allen Bildern, Maßen und Notizen endgültig löschen?`}
              className={`${KNOPF_KLEIN} text-red-600 dark:text-red-400`}
            >
              Löschen
            </BestaetigenKnopf>
          </form>
        </div>
      </header>

      {/* Am Desktop zweispaltig: links Bilder groß, rechts Maße und Daten – für den Bildschirm neben dem CAD. */}
      <div className="grid gap-x-8 lg:grid-cols-2">
        <div>
          <Abschnitt titel="Bilder und Dateien">
            <AnhangBereich anhaenge={a.anhaenge} auftragId={a.id} />
          </Abschnitt>

          {a.beschreibung && (
            <Abschnitt titel="Beschreibung">
              <Karte className="whitespace-pre-wrap p-4 text-sm">{a.beschreibung}</Karte>
            </Abschnitt>
          )}
        </div>

        <div>
          <Abschnitt titel="Maße">
            <MassBereich masse={a.masse} auftragId={a.id} />
          </Abschnitt>

          <Abschnitt titel="Daten">
            <Karte className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-sm">
              {daten
                .filter(([, wert]) => wert != null && wert !== false && wert !== "")
                .map(([name, wert]) => (
                  <div key={name}>
                    <div className="text-gedaempft">{name}</div>
                    <div className="tabular-nums">{wert}</div>
                  </div>
                ))}
            </Karte>
          </Abschnitt>
        </div>
      </div>

      <Abschnitt titel="Notizen und Verlauf">
        <Karte>
          <form action={notizHinzufuegen} className="space-y-3 p-4 print:hidden">
            <input type="hidden" name="auftragId" value={a.id} />
            <textarea name="text" rows={2} required placeholder="Notiz hinzufügen …" aria-label="Notiz" className={TEXTFELD} />
            <AbsendeKnopf className={KNOPF_ZWEIT}>Notiz speichern</AbsendeKnopf>
          </form>
          {a.notizen.length > 0 && (
            <ul className="divide-y divide-linie border-t border-linie">
              {a.notizen.map((n) => (
                <li key={n.id} className="flex gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gedaempft">
                      {datumZeit(n.erstelltAm)}
                      {n.autor && ` · ${n.autor.name}`}
                      {n.art === "STATUSWECHSEL" && " · Status geändert"}
                    </div>
                    <div className={`whitespace-pre-wrap text-sm ${n.art === "STATUSWECHSEL" ? "text-gedaempft" : ""}`}>
                      {n.text}
                    </div>
                  </div>
                  {n.art === "NOTIZ" && (
                    <form action={notizLoeschen} className="print:hidden">
                      <input type="hidden" name="id" value={n.id} />
                      <BestaetigenKnopf
                        frage="Diese Notiz löschen?"
                        className="grid size-8 place-items-center rounded-lg text-gedaempft hover:text-red-600"
                      >
                        ✕
                      </BestaetigenKnopf>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Karte>
      </Abschnitt>
    </>
  );
}
