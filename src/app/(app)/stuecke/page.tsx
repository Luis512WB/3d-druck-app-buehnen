import type { Metadata } from "next";
import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { datum } from "@/lib/format";
import { ABGESCHLOSSENE_STATUS, STUECK_STATUS } from "@/lib/werte";
import { KNOPF } from "@/components/ui/formular";
import { Chip, Karte, Leerzustand, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Stücke" };

export default async function Stuecke({ searchParams }: { searchParams: Promise<{ archiv?: string }> }) {
  await erfordereBenutzer();
  const mitArchiv = (await searchParams).archiv === "1";

  const stuecke = await db.stueck.findMany({
    where: mitArchiv ? {} : { status: { not: "ARCHIVIERT" } },
    orderBy: [{ premiere: "desc" }, { titel: "asc" }],
    include: {
      anhaenge: { where: { art: "BILD", vorschauPfad: { not: null } }, take: 1, select: { id: true } },
      auftraege: { where: { status: { notIn: ABGESCHLOSSENE_STATUS } }, select: { id: true } },
      _count: { select: { auftraege: true } },
    },
  });

  return (
    <>
      <Seitenkopf
        titel="Stücke"
        text="Produktionen, zu denen Aufträge gehören."
        aktion={
          <Link href="/stuecke/neu" className={KNOPF}>
            Neues Stück
          </Link>
        }
      />

      {stuecke.length === 0 ? (
        <Leerzustand titel="Noch keine Stücke" text="Lege das erste Stück an, z. B. Otello – danach kannst du Aufträge dazu erfassen." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stuecke.map((s) => (
            <Link key={s.id} href={`/stuecke/${s.id}`}>
              <Karte className="h-full overflow-hidden transition-colors hover:border-akzent">
                <div className="aspect-[16/7] bg-hintergrund">
                  {s.anhaenge[0] && (
                    // eslint-disable-next-line @next/next/no-img-element -- geschützte Datei-Route
                    <img src={`/api/dateien/${s.anhaenge[0].id}?g=vorschau`} alt="" className="size-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium">{s.titel}</div>
                  <div className="text-sm text-gedaempft">
                    {[s.sparte, s.spielzeit, s.premiere ? `Premiere ${datum(s.premiere)}` : null].filter(Boolean).join(" · ") || "–"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip>
                      {s.auftraege.length} offen · {s._count.auftraege} gesamt
                    </Chip>
                    {s.status !== "AKTIV" && <Chip>{STUECK_STATUS[s.status as keyof typeof STUECK_STATUS] ?? s.status}</Chip>}
                  </div>
                </div>
              </Karte>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm">
        <Link href={mitArchiv ? "/stuecke" : "/stuecke?archiv=1"} className="text-gedaempft underline">
          {mitArchiv ? "Archivierte ausblenden" : "Archivierte Stücke anzeigen"}
        </Link>
      </p>
    </>
  );
}
