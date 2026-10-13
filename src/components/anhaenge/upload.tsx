"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormZustand } from "@/lib/typen";
import { anhaengeHochladen } from "@/server/anhaenge";
import { Fehler, KNOPF_ZWEIT } from "@/components/ui/formular";

type Zuordnung = { auftragId?: number; stueckId?: number; bibliothekseintragId?: number };

// Zwei Wege: Bilder (am Handy öffnet das Kamera oder Galerie) und beliebige Dateien (CAD, Slicer, PDF).
// Die Auswahl wird sofort hochgeladen – kein zusätzlicher Speichern-Knopf.
export function Upload(zuordnung: Zuordnung) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(anhaengeHochladen, {});
  const formular = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (zustand.ok) formular.current?.reset();
  }, [zustand]);

  const absenden = () => formular.current?.requestSubmit();

  return (
    <form ref={formular} action={aktion} className="space-y-3">
      {Object.entries(zuordnung).map(([name, wert]) => wert && <input key={name} type="hidden" name={name} value={wert} />)}

      <div className="flex flex-wrap gap-2">
        <label className={`${KNOPF_ZWEIT} cursor-pointer ${laeuft ? "pointer-events-none opacity-60" : ""}`}>
          {laeuft ? "Lädt hoch …" : "Foto / Bild hinzufügen"}
          <input type="file" name="dateien" accept="image/*" multiple hidden onChange={absenden} />
        </label>
        <label className={`${KNOPF_ZWEIT} cursor-pointer ${laeuft ? "pointer-events-none opacity-60" : ""}`}>
          Datei hinzufügen
          <input type="file" name="dateien" multiple hidden onChange={absenden} />
        </label>
      </div>
      <Fehler text={zustand.fehler} />
    </form>
  );
}
