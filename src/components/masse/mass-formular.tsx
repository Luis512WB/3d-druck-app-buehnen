"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormZustand } from "@/lib/typen";
import { massHinzufuegen } from "@/server/masse";
import { EINGABE, Fehler, KNOPF_ZWEIT } from "@/components/ui/formular";

export function MassFormular({
  auftragId,
  bibliothekseintragId,
}: {
  auftragId?: number;
  bibliothekseintragId?: number;
}) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(massHinzufuegen, {});
  const formular = useRef<HTMLFormElement>(null);
  const inBibliothek = Boolean(bibliothekseintragId);

  // Nach dem Speichern leeren und direkt das nächste Maß eintippen lassen.
  useEffect(() => {
    if (zustand.ok) {
      formular.current?.reset();
      formular.current?.querySelector<HTMLInputElement>("input[name=bezeichnung]")?.focus();
    }
  }, [zustand]);

  return (
    <form ref={formular} action={aktion} className="space-y-3 border-t border-linie p-4">
      {auftragId && <input type="hidden" name="auftragId" value={auftragId} />}
      {bibliothekseintragId && <input type="hidden" name="bibliothekseintragId" value={bibliothekseintragId} />}

      <div className="grid grid-cols-6 gap-2">
        {inBibliothek && (
          <input
            name="variante"
            placeholder="Variante (z. B. M20)"
            aria-label="Variante"
            className={`${EINGABE} col-span-6 sm:col-span-2`}
          />
        )}
        <input
          name="bezeichnung"
          required
          placeholder="Bezeichnung"
          aria-label="Bezeichnung"
          className={`${EINGABE} col-span-6 ${inBibliothek ? "sm:col-span-4" : ""}`}
        />
        <input
          name="wert"
          required
          inputMode="decimal"
          placeholder="Wert"
          aria-label="Wert"
          className={`${EINGABE} col-span-4 sm:col-span-2`}
        />
        <select name="einheit" aria-label="Einheit" className={`${EINGABE} col-span-2 sm:col-span-1`}>
          <option>mm</option>
          <option>cm</option>
          <option>m</option>
          <option>°</option>
        </select>
        <input name="notiz" placeholder="Notiz (optional)" aria-label="Notiz" className={`${EINGABE} col-span-6 sm:col-span-3`} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={laeuft} className={KNOPF_ZWEIT}>
          {laeuft ? "Speichern …" : "Maß hinzufügen"}
        </button>
        {inBibliothek && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="geprueft" className="size-4" />
            nachgemessen / erprobt
          </label>
        )}
      </div>
      <Fehler text={zustand.fehler} />
    </form>
  );
}
