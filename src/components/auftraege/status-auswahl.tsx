"use client";

import { startTransition, useActionState, useEffect, useOptimistic, useState } from "react";
import { createPortal } from "react-dom";
import { statusFarbe } from "@/lib/format";
import type { FormZustand } from "@/lib/typen";
import { AUFTRAG_STATUS, DRUCKER_ZUSTAND, type DruckerZustand } from "@/lib/werte";
import { statusAendern } from "@/server/auftraege";
import { Fehler } from "@/components/ui/formular";

export type DruckerAuswahl = { id: number; name: string; zustand: string; belegtDurch?: string[] };

export function druckerName(d: DruckerAuswahl) {
  return d.zustand === "BEREIT" ? d.name : `${d.name} (${DRUCKER_ZUSTAND[d.zustand as DruckerZustand] ?? d.zustand})`;
}

// Status als kleines Auswahlfeld mit Farbmarke – überall dort, wo ein Auftrag angezeigt wird.
// Jeder Status wird sofort gespeichert; „Im Druck“ fragt vorher in einem Fenster nach dem Drucker.
export function StatusAuswahl({
  auftragId,
  bezeichnung,
  status,
  druckerId,
  drucker,
  gross,
}: {
  auftragId: number;
  bezeichnung: string;
  status: string;
  druckerId: number | null;
  drucker: DruckerAuswahl[];
  gross?: boolean;
}) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(statusAendern, {});
  const [fensterOffen, setFensterOffen] = useState(false);
  // Zeigt die Auswahl sofort an, bis der Server den neuen Stand bestätigt hat.
  const [anzeige, setAnzeige] = useOptimistic({ status, druckerId });
  const aktuellerDrucker = drucker.find((d) => d.id === anzeige.druckerId);

  function speichern(neu: string, neuerDrucker?: number) {
    const daten = new FormData();
    daten.set("id", String(auftragId));
    daten.set("status", neu);
    if (neuerDrucker) daten.set("druckerId", String(neuerDrucker));
    // Von Hand in einer Transition statt über <form action>: React würde sonst das Formular
    // nach dem Speichern zurücksetzen und kurz den alten Wert zeigen.
    startTransition(() => {
      setAnzeige({ status: neu, druckerId: neuerDrucker ?? (neu === "IM_DRUCK" ? druckerId : null) });
      aktion(daten);
    });
  }

  return (
    <div className="relative z-10 inline-flex flex-wrap items-center gap-2">
      <select
        aria-label={`Status von ${bezeichnung}`}
        value={anzeige.status}
        onChange={(e) => {
          if (e.target.value === "IM_DRUCK") setFensterOffen(true);
          else speichern(e.target.value);
        }}
        style={{ borderLeftColor: statusFarbe(anzeige.status) }}
        className={`cursor-pointer rounded-[3px] border border-l-[3px] border-linie bg-flaeche font-mono font-semibold uppercase tracking-wide text-schrift ${laeuft ? "opacity-70" : ""} ${
          gross ? "h-10 pl-3 text-xs" : "h-7 pl-2 text-[11px]"
        }`}
      >
        {Object.entries(AUFTRAG_STATUS).map(([wert, name]) => (
          <option key={wert} value={wert}>
            {name}
          </option>
        ))}
      </select>

      {anzeige.status === "IM_DRUCK" && aktuellerDrucker && (
        <button
          type="button"
          onClick={() => setFensterOffen(true)}
          title="Drucker wechseln"
          className={`inline-flex items-center gap-1.5 rounded-[3px] border border-linie bg-flaeche-2 px-2 font-mono text-gedaempft hover:text-schrift ${
            gross ? "h-10 text-xs" : "h-7 text-[11px]"
          }`}
        >
          <span className="size-[7px] rounded-[1px] bg-akzent" />
          {aktuellerDrucker.name}
        </button>
      )}

      {zustand.fehler && (
        <div className="basis-full">
          <Fehler text={zustand.fehler} />
        </div>
      )}

      {fensterOffen && (
        <DruckerFenster
          bezeichnung={bezeichnung}
          drucker={drucker}
          aktuell={anzeige.status === "IM_DRUCK" ? anzeige.druckerId : null}
          onWahl={(id) => {
            setFensterOffen(false);
            speichern("IM_DRUCK", id);
          }}
          onAbbruch={() => setFensterOffen(false)}
        />
      )}
    </div>
  );
}

function DruckerFenster({
  bezeichnung,
  drucker,
  aktuell,
  onWahl,
  onAbbruch,
}: {
  bezeichnung: string;
  drucker: DruckerAuswahl[];
  aktuell: number | null;
  onWahl: (id: number) => void;
  onAbbruch: () => void;
}) {
  useEffect(() => {
    const taste = (e: KeyboardEvent) => e.key === "Escape" && onAbbruch();
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, [onAbbruch]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center" onClick={onAbbruch}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Drucker wählen"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-lg border-t border-linie bg-flaeche px-4 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-lg sm:border"
      >
        <h2 className="font-bold">Auf welchem Drucker wird gedruckt?</h2>
        <p className="mt-0.5 truncate text-sm text-gedaempft">{bezeichnung}</p>
        <div className="mt-3 space-y-2">
          {drucker.map((d) => {
            const belegt = (d.belegtDurch ?? []).length > 0 && d.id !== aktuell;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onWahl(d.id)}
                className="flex w-full items-center gap-3 rounded-[5px] border border-linie bg-flaeche p-3 text-left hover:border-akzent"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{druckerName(d)}</span>
                  <span className="block truncate text-sm text-gedaempft">
                    {belegt ? `druckt gerade ${d.belegtDurch!.join(", ")}` : "bereit"}
                  </span>
                </span>
                <span className="inline-flex h-6 items-center gap-1.5 rounded-[3px] border border-linie px-2 font-mono text-[11px] font-medium uppercase">
                  <span
                    className="size-[7px] rounded-[1px]"
                    style={{ backgroundColor: d.id === aktuell ? "var(--akzent)" : belegt ? "#c9a227" : "#5f9e6e" }}
                  />
                  {d.id === aktuell ? "Aktuell" : belegt ? "Belegt" : "Frei"}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onAbbruch}
          className="mt-3 h-11 w-full rounded-[5px] border border-linie bg-flaeche text-sm font-semibold"
        >
          Abbrechen
        </button>
      </div>
    </div>,
    document.body,
  );
}
