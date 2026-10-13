import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { ABGESCHLOSSENE_STATUS } from "@/lib/werte";
import { Karte, Seitenkopf } from "@/components/ui/seite";
import { DruckerListe } from "@/components/drucker-liste";

export default async function Uebersicht() {
  const benutzer = await erfordereBenutzer();

  const [offen, stuecke, eintraege, drucker] = await Promise.all([
    db.auftrag.count({ where: { status: { notIn: ABGESCHLOSSENE_STATUS } } }),
    db.stueck.count({ where: { status: { not: "ARCHIVIERT" } } }),
    db.bibliothekseintrag.count(),
    db.drucker.findMany({ orderBy: { name: "asc" } }),
  ]);

  const kacheln = [
    { href: "/auftraege", zahl: offen, name: "Offene Aufträge" },
    { href: "/stuecke", zahl: stuecke, name: "Stücke" },
    { href: "/bibliothek", zahl: eintraege, name: "Einträge in der Maßbibliothek" },
  ];

  return (
    <>
      <Seitenkopf titel={`Hallo ${benutzer.name}`} text="Das ist der aktuelle Stand." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {kacheln.map((k) => (
          <Link key={k.href} href={k.href}>
            <Karte className="p-5 transition-colors hover:border-akzent">
              <div className="text-3xl font-semibold tabular-nums">{k.zahl}</div>
              <div className="mt-1 text-sm text-gedaempft">{k.name}</div>
            </Karte>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-medium text-gedaempft">Drucker</h2>
      <DruckerListe drucker={drucker} />
    </>
  );
}
