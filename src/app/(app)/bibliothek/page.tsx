import type { Metadata } from "next";
import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { EINGABE, KNOPF } from "@/components/ui/formular";
import { Karte, Leerzustand, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Maßbibliothek" };

export default async function Bibliothek({ searchParams }: { searchParams: Promise<{ q?: string; kategorie?: string }> }) {
  await erfordereBenutzer();
  const { q, kategorie } = await searchParams;
  const kategorieId = Number(kategorie) || undefined;

  const [kategorien, eintraege] = await Promise.all([
    db.bibliothekskategorie.findMany({ orderBy: { reihenfolge: "asc" } }),
    db.bibliothekseintrag.findMany({
      where: {
        ...(kategorieId ? { kategorieId } : {}),
        ...(q
          ? {
              OR: [
                { titel: { contains: q } },
                { schlagworte: { contains: q } },
                { beschreibung: { contains: q } },
                { masse: { some: { OR: [{ bezeichnung: { contains: q } }, { variante: { contains: q } }] } } },
              ],
            }
          : {}),
      },
      orderBy: { titel: "asc" },
      include: {
        kategorie: true,
        anhaenge: { where: { art: "BILD", vorschauPfad: { not: null } }, take: 1, select: { id: true } },
        _count: { select: { masse: true } },
      },
    }),
  ]);

  const chip = (aktiv: boolean) =>
    `inline-flex h-9 items-center rounded-full border px-3.5 text-sm ${
      aktiv ? "border-akzent bg-akzent-zart font-medium text-akzent" : "border-linie bg-flaeche text-gedaempft"
    }`;
  const mitSuche = (id?: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (id) p.set("kategorie", String(id));
    const s = p.toString();
    return s ? `/bibliothek?${s}` : "/bibliothek";
  };

  return (
    <>
      <Seitenkopf
        titel="Maßbibliothek"
        text="Standardmaße für den Alltag."
        aktion={
          <Link href="/bibliothek/neu" className={KNOPF}>
            Neuer Eintrag
          </Link>
        }
      />

      <form action="/bibliothek" className="mb-3">
        {kategorieId && <input type="hidden" name="kategorie" value={kategorieId} />}
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Suchen, z. B. M20 oder DMX …"
          aria-label="Suchen"
          className={EINGABE}
        />
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={mitSuche()} className={chip(!kategorieId)}>
          Alle
        </Link>
        {kategorien.map((k) => (
          <Link key={k.id} href={mitSuche(k.id)} className={chip(kategorieId === k.id)}>
            {k.name}
          </Link>
        ))}
      </div>

      {eintraege.length === 0 ? (
        <Leerzustand
          titel={q || kategorieId ? "Nichts gefunden" : "Noch keine Einträge"}
          text={
            q || kategorieId
              ? "Dazu ist noch nichts hinterlegt."
              : "Lege den ersten Eintrag an, z. B. eine Kabelverschraubung mit ihren Maßen."
          }
        />
      ) : (
        <Karte className="divide-y divide-linie">
          {eintraege.map((e) => (
            <Link key={e.id} href={`/bibliothek/${e.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-hintergrund">
              <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-linie bg-hintergrund">
                {e.anhaenge[0] && (
                  // eslint-disable-next-line @next/next/no-img-element -- geschützte Datei-Route
                  <img src={`/api/dateien/${e.anhaenge[0].id}?g=mini`} alt="" className="size-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{e.titel}</div>
                <div className="truncate text-sm text-gedaempft">
                  {[e.kategorie?.name, `${e._count.masse} ${e._count.masse === 1 ? "Maß" : "Maße"}`].filter(Boolean).join(" · ")}
                </div>
              </div>
              <span aria-hidden className="text-gedaempft">
                ›
              </span>
            </Link>
          ))}
        </Karte>
      )}
    </>
  );
}
