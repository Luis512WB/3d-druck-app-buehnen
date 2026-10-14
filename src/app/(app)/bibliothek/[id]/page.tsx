import Link from "next/link";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { ABGESCHLOSSENE_STATUS } from "@/lib/werte";
import { eintragLoeschen } from "@/server/bibliothek";
import { masseUebernehmen } from "@/server/masse";
import { AnhangBereich } from "@/components/anhaenge/anhang-bereich";
import { MassBereich } from "@/components/masse/mass-bereich";
import { Abschnitt, EINGABE, KNOPF_KLEIN, KNOPF_ZWEIT } from "@/components/ui/formular";
import { AbsendeKnopf, BestaetigenKnopf } from "@/components/ui/knoepfe";
import { Karte, Seitenkopf } from "@/components/ui/seite";

export default async function EintragDetail({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer();
  const eintrag = await db.bibliothekseintrag.findUnique({
    where: { id: Number((await params).id) || 0 },
    include: {
      kategorie: true,
      masse: { orderBy: [{ variante: "asc" }, { reihenfolge: "asc" }] },
      anhaenge: { orderBy: { id: "asc" } },
    },
  });
  if (!eintrag) notFound();

  const offeneAuftraege = await db.auftrag.findMany({
    where: { status: { notIn: ABGESCHLOSSENE_STATUS } },
    orderBy: { id: "desc" },
    select: { id: true, nummer: true, titel: true },
  });
  const varianten = [...new Set(eintrag.masse.map((m) => m.variante).filter((v): v is string => Boolean(v)))];

  return (
    <>
      <Seitenkopf
        titel={eintrag.titel}
        text={[eintrag.kategorie?.name, eintrag.quelle && `Quelle: ${eintrag.quelle}`].filter(Boolean).join(" · ")}
        aktion={
          <Link href={`/bibliothek/${eintrag.id}/bearbeiten`} className={KNOPF_KLEIN}>
            Bearbeiten
          </Link>
        }
      />

      {eintrag.druckhinweis && (
        <Karte className="mb-4 border-akzent bg-akzent-zart p-4 text-sm">
          <div className="font-medium text-akzent">Druckhinweis</div>
          <p className="mt-1 whitespace-pre-wrap">{eintrag.druckhinweis}</p>
        </Karte>
      )}
      {eintrag.beschreibung && <p className="whitespace-pre-wrap text-sm">{eintrag.beschreibung}</p>}

      <div className="grid gap-x-8 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <Abschnitt titel="Maße">
            <MassBereich masse={eintrag.masse} bibliothekseintragId={eintrag.id} />
          </Abschnitt>

          {eintrag.masse.length > 0 && (
            <Abschnitt titel="In Auftrag übernehmen">
              <Karte className="p-4">
                {offeneAuftraege.length === 0 ? (
                  <p className="text-sm text-gedaempft">Es gibt gerade keinen offenen Auftrag.</p>
                ) : (
                  <form action={masseUebernehmen} className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <input type="hidden" name="bibliothekseintragId" value={eintrag.id} />
                    <select name="auftragId" required aria-label="Auftrag" className={EINGABE}>
                      {offeneAuftraege.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nummer} · {a.titel}
                        </option>
                      ))}
                    </select>
                    {varianten.length > 0 && (
                      <select name="variante" aria-label="Variante" className={EINGABE}>
                        <option value="">Alle Varianten</option>
                        {varianten.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    )}
                    <AbsendeKnopf className={KNOPF_ZWEIT}>Maße kopieren</AbsendeKnopf>
                  </form>
                )}
              </Karte>
            </Abschnitt>
          )}
        </div>

        <div>
          <Abschnitt titel="Bilder, Zeichnungen und Dateien">
            <AnhangBereich anhaenge={eintrag.anhaenge} bibliothekseintragId={eintrag.id} />
          </Abschnitt>
        </div>
      </div>

      <form action={eintragLoeschen} className="mt-10">
        <input type="hidden" name="id" value={eintrag.id} />
        <BestaetigenKnopf
          frage={`„${eintrag.titel}“ mit allen Maßen und Dateien endgültig löschen?`}
          className={`${KNOPF_KLEIN} text-warnung`}
        >
          Eintrag löschen
        </BestaetigenKnopf>
      </form>
    </>
  );
}
