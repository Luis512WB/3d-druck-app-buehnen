"use client";

import { startTransition, useActionState, useState } from "react";
import type { FormZustand } from "@/lib/typen";
import { AUFTRAG_STATUS, DRUCKER_ZUSTAND, type DruckerZustand } from "@/lib/werte";
import { statusAendern } from "@/server/auftraege";
import { EINGABE, Fehler, KNOPF } from "@/components/ui/formular";

export type DruckerAuswahl = { id: number; name: string; zustand: string };

export function druckerName(d: DruckerAuswahl) {
  return d.zustand === "BEREIT" ? d.name : `${d.name} (${DRUCKER_ZUSTAND[d.zustand as DruckerZustand] ?? d.zustand})`;
}

// Jeder Status wird sofort gespeichert – außer „Im Druck“: Dort muss erst der Drucker gewählt werden.
export function StatusAuswahl({
  auftragId,
  status,
  druckerId,
  drucker,
}: {
  auftragId: number;
  status: string;
  druckerId: number | null;
  drucker: DruckerAuswahl[];
}) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(statusAendern, {});
  const [gewaehlt, setGewaehlt] = useState(status);
  const [gewaehlterDrucker, setGewaehlterDrucker] = useState(druckerId ? String(druckerId) : "");

  const imDruck = gewaehlt === "IM_DRUCK";
  const ungespeichert = imDruck && (status !== "IM_DRUCK" || gewaehlterDrucker !== String(druckerId ?? ""));

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      // Von Hand abgeschickt statt über action={…}: React würde das Formular sonst nach dem
      // Speichern zurücksetzen und die Auswahlfelder zeigten kurz wieder den alten Wert.
      onSubmit={(e) => {
        e.preventDefault();
        const daten = new FormData(e.currentTarget);
        startTransition(() => aktion(daten));
      }}
    >
      <input type="hidden" name="id" value={auftragId} />
      <select
        name="status"
        aria-label="Status"
        value={gewaehlt}
        disabled={laeuft}
        className={`${EINGABE} w-auto pr-8`}
        onChange={(e) => {
          setGewaehlt(e.target.value);
          if (e.target.value !== "IM_DRUCK") e.currentTarget.form?.requestSubmit();
        }}
      >
        {Object.entries(AUFTRAG_STATUS).map(([wert, name]) => (
          <option key={wert} value={wert}>
            {name}
          </option>
        ))}
      </select>

      {imDruck && (
        <select
          name="druckerId"
          aria-label="Drucker"
          required
          value={gewaehlterDrucker}
          disabled={laeuft}
          className={`${EINGABE} w-auto pr-8`}
          onChange={(e) => setGewaehlterDrucker(e.target.value)}
        >
          <option value="">Drucker wählen …</option>
          {drucker.map((d) => (
            <option key={d.id} value={d.id}>
              {druckerName(d)}
            </option>
          ))}
        </select>
      )}

      {ungespeichert && (
        <button disabled={laeuft} className={KNOPF}>
          {laeuft ? "Speichern …" : "Übernehmen"}
        </button>
      )}
      <div className="basis-full empty:hidden">
        <Fehler text={zustand.fehler} />
      </div>
    </form>
  );
}
