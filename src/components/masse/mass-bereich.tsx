import type { Mass } from "@prisma/client";
import { zahl } from "@/lib/format";
import { massGeprueftUmschalten, massLoeschen } from "@/server/masse";
import { Karte } from "@/components/ui/seite";
import { MassFormular } from "./mass-formular";

export function MassBereich({
  masse,
  auftragId,
  bibliothekseintragId,
}: {
  masse: Mass[];
  auftragId?: number;
  bibliothekseintragId?: number;
}) {
  const inBibliothek = Boolean(bibliothekseintragId);
  const geordnet = [...masse].sort((a, b) => a.reihenfolge - b.reihenfolge);
  const varianten = [...new Set(geordnet.map((m) => m.variante).filter((v): v is string => Boolean(v)))];
  const spalten = [...new Set(geordnet.filter((m) => m.variante).map((m) => m.bezeichnung))];

  const liste = (
    <ul className="divide-y divide-linie-2">
      {geordnet.map((m) => (
        <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="text-sm">
              {m.variante && (
                <span className="mr-2 rounded-[3px] border border-linie px-1.5 py-0.5 font-mono text-[11px] font-semibold">
                  {m.variante}
                </span>
              )}
              {m.bezeichnung}
            </div>
            {m.notiz && <div className="truncate text-xs text-gedaempft">{m.notiz}</div>}
          </div>
          <div className="shrink-0 font-mono font-semibold select-all">
            {zahl(m.wert)}
            <span className="ml-1 font-normal text-gedaempft">{m.einheit}</span>
          </div>
          {inBibliothek && (
            <form action={massGeprueftUmschalten}>
              <input type="hidden" name="id" value={m.id} />
              <button
                title={m.geprueft ? "Nachgemessen / erprobt" : "Nur laut Datenblatt – antippen, wenn geprüft"}
                className={`grid size-9 place-items-center rounded-[4px] border text-sm ${
                  m.geprueft ? "border-akzent text-akzent" : "border-linie text-gedaempft"
                }`}
              >
                {m.geprueft ? "✓" : "?"}
              </button>
            </form>
          )}
          <form action={massLoeschen}>
            <input type="hidden" name="id" value={m.id} />
            <button
              aria-label={`${m.bezeichnung} löschen`}
              className="grid size-9 place-items-center rounded-[4px] text-gedaempft hover:text-warnung"
            >
              ✕
            </button>
          </form>
        </li>
      ))}
    </ul>
  );

  // Größenreihen (z. B. M2 bis M10) als Tabelle: eine Zeile pro Variante, eine Spalte pro Maß.
  if (inBibliothek && varianten.length > 1) {
    return (
      <Karte>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-flaeche-2">
                <th className="sticky left-0 bg-flaeche-2 px-3 py-2 text-left align-bottom font-mono text-[10px] font-semibold uppercase tracking-wide text-gedaempft">
                  Größe
                </th>
                {spalten.map((s) => (
                  <th
                    key={s}
                    className="min-w-22 px-3 py-2 text-right align-bottom font-mono text-[10px] font-semibold uppercase tracking-wide text-gedaempft"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {varianten.map((v) => (
                <tr key={v} className="border-t border-linie-2 hover:bg-flaeche-2">
                  <th className="sticky left-0 bg-flaeche px-3 py-2 text-left font-mono text-[13px] font-semibold whitespace-nowrap">
                    {v}
                  </th>
                  {spalten.map((s) => {
                    const m = geordnet.find((x) => x.variante === v && x.bezeichnung === s);
                    return (
                      <td key={s} className="px-3 py-2 text-right font-mono whitespace-nowrap">
                        {m ? (
                          <>
                            {zahl(m.wert)}
                            <span className="ml-1 text-gedaempft">{m.einheit}</span>
                          </>
                        ) : (
                          "–"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="border-t border-linie">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Einzelne Maße bearbeiten</summary>
          <div className="border-t border-linie-2">{liste}</div>
          <MassFormular auftragId={auftragId} bibliothekseintragId={bibliothekseintragId} />
        </details>
      </Karte>
    );
  }

  return (
    <Karte>
      {masse.length === 0 ? <p className="px-4 py-5 text-sm text-gedaempft">Noch keine Maße eingetragen.</p> : liste}
      <MassFormular auftragId={auftragId} bibliothekseintragId={bibliothekseintragId} />
    </Karte>
  );
}
