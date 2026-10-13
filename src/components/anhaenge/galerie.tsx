"use client";

import { useEffect, useState } from "react";

type Bild = { id: number; dateiname: string; beschriftung: string | null };

// Miniaturen im Raster; Antippen öffnet die große Ansicht mit Blättern.
export function Galerie({ bilder }: { bilder: Bild[] }) {
  const [offen, setOffen] = useState<number | null>(null);
  const anzahl = bilder.length;

  useEffect(() => {
    if (offen === null) return;
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(null);
      if (e.key === "ArrowRight") setOffen((i) => (i === null ? i : (i + 1) % anzahl));
      if (e.key === "ArrowLeft") setOffen((i) => (i === null ? i : (i - 1 + anzahl) % anzahl));
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, [offen, anzahl]);

  const aktuell = offen === null ? null : bilder[offen];

  return (
    <>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {bilder.map((b, i) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => setOffen(i)}
              className="block aspect-square w-full overflow-hidden rounded-lg border border-linie bg-hintergrund"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- geschützte Datei-Route */}
              <img src={`/api/dateien/${b.id}?g=mini`} alt={b.dateiname} className="size-full object-cover" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      {aktuell && (
        <div
          role="dialog"
          aria-modal
          aria-label={aktuell.dateiname}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
          onClick={() => setOffen(null)}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
            <span className="truncate">
              {offen! + 1} / {anzahl} · {aktuell.dateiname}
            </span>
            <span className="flex shrink-0 gap-4">
              <a href={`/api/dateien/${aktuell.id}?download=1`} className="underline">
                Original
              </a>
              <button type="button" onClick={() => setOffen(null)} aria-label="Schließen">
                ✕
              </button>
            </span>
          </div>
          <div className="relative min-h-0 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element -- geschützte Datei-Route */}
            <img
              src={`/api/dateien/${aktuell.id}?g=vorschau`}
              alt={aktuell.dateiname}
              className="absolute inset-0 size-full object-contain"
            />
            {anzahl > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Vorheriges Bild"
                  className="absolute inset-y-0 left-0 w-1/4 text-left text-3xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOffen((offen! - 1 + anzahl) % anzahl);
                  }}
                >
                  <span className="pl-3">‹</span>
                </button>
                <button
                  type="button"
                  aria-label="Nächstes Bild"
                  className="absolute inset-y-0 right-0 w-1/4 text-right text-3xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOffen((offen! + 1) % anzahl);
                  }}
                >
                  <span className="pr-3">›</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
