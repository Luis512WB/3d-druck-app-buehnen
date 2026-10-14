import type { Anhang } from "@prisma/client";
import { groesse } from "@/lib/format";
import { anhangLoeschen } from "@/server/anhaenge";
import { BestaetigenKnopf } from "@/components/ui/knoepfe";
import { Karte } from "@/components/ui/seite";
import { Galerie } from "./galerie";
import { Upload } from "./upload";

const ART: Record<string, string> = { CAD: "CAD", SLICER: "Slicer", DOKUMENT: "Dokument", SONSTIGES: "Datei", BILD: "Bild" };

export function AnhangBereich({
  anhaenge,
  ...zuordnung
}: {
  anhaenge: Anhang[];
  auftragId?: number;
  stueckId?: number;
  bibliothekseintragId?: number;
}) {
  // Bilder ohne Vorschau (nicht lesbares Format) erscheinen in der Dateiliste.
  const bilder = anhaenge.filter((a) => a.art === "BILD" && a.vorschauPfad);
  const dateien = anhaenge.filter((a) => !(a.art === "BILD" && a.vorschauPfad));

  return (
    <Karte className="space-y-4 p-4">
      {anhaenge.length === 0 && <p className="text-sm text-gedaempft">Noch keine Bilder oder Dateien.</p>}

      {bilder.length > 0 && (
        <Galerie bilder={bilder.map((b) => ({ id: b.id, dateiname: b.dateiname, beschriftung: b.beschriftung }))} />
      )}

      {anhaenge.length > 0 && (
        <ul className="divide-y divide-linie text-sm">
          {[...dateien, ...bilder].map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-2">
              <a href={`/api/dateien/${d.id}?download=1`} className="min-w-0 flex-1 truncate hover:text-akzent">
                {d.dateiname}
              </a>
              <span className="shrink-0 text-xs text-gedaempft">
                {ART[d.art] ?? d.art} · {groesse(d.groesseBytes)}
              </span>
              <form action={anhangLoeschen}>
                <input type="hidden" name="id" value={d.id} />
                <BestaetigenKnopf
                  frage={`„${d.dateiname}“ wirklich löschen?`}
                  className="grid size-8 place-items-center rounded-lg text-gedaempft hover:text-warnung"
                >
                  ✕
                </BestaetigenKnopf>
              </form>
            </li>
          ))}
        </ul>
      )}

      <Upload {...zuordnung} />
    </Karte>
  );
}
