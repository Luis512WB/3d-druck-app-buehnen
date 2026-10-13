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

  return (
    <Karte>
      {masse.length === 0 ? (
        <p className="px-4 py-5 text-sm text-gedaempft">Noch keine Maße eingetragen.</p>
      ) : (
        <ul className="divide-y divide-linie">
          {masse.map((m) => (
            <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  {m.variante && <span className="mr-2 font-medium">{m.variante}</span>}
                  {m.bezeichnung}
                </div>
                {m.notiz && <div className="truncate text-xs text-gedaempft">{m.notiz}</div>}
              </div>
              <div className="shrink-0 font-medium tabular-nums select-all">
                {zahl(m.wert)} <span className="font-normal text-gedaempft">{m.einheit}</span>
              </div>
              {inBibliothek && (
                <form action={massGeprueftUmschalten}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    title={m.geprueft ? "Nachgemessen / erprobt" : "Nur laut Datenblatt – antippen, wenn geprüft"}
                    className={`grid size-9 place-items-center rounded-lg border text-sm ${
                      m.geprueft ? "border-green-600 text-green-600" : "border-linie text-gedaempft"
                    }`}
                  >
                    {m.geprueft ? "✓" : "?"}
                  </button>
                </form>
              )}
              <form action={massLoeschen}>
                <input type="hidden" name="id" value={m.id} />
                <button aria-label={`${m.bezeichnung} löschen`} className="grid size-9 place-items-center rounded-lg text-gedaempft hover:text-red-600">
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <MassFormular auftragId={auftragId} bibliothekseintragId={bibliothekseintragId} />
    </Karte>
  );
}
