"use client";

import { useActionState, useState } from "react";
import type { Bibliothekseintrag } from "@prisma/client";
import type { FormZustand } from "@/lib/typen";
import { eintragSpeichern } from "@/server/bibliothek";
import { EINGABE, Fehler, Feld, KNOPF, TEXTFELD } from "@/components/ui/formular";

export function EintragFormular({
  eintrag,
  kategorien,
}: {
  eintrag?: Bibliothekseintrag;
  kategorien: { id: number; name: string }[];
}) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(eintragSpeichern, {});
  const [kategorieWahl, setKategorieWahl] = useState(String(eintrag?.kategorieId ?? ""));

  return (
    <form action={aktion} className="grid gap-4 sm:grid-cols-2">
      {eintrag && <input type="hidden" name="id" value={eintrag.id} />}

      <Feld label="Titel" className="sm:col-span-2">
        <input
          name="titel"
          required
          defaultValue={eintrag?.titel}
          placeholder="z. B. Kabelverschraubung metrisch"
          className={EINGABE}
        />
      </Feld>
      <Feld label="Kategorie">
        <select
          name="kategorieId"
          value={kategorieWahl}
          onChange={(e) => setKategorieWahl(e.target.value)}
          className={EINGABE}
        >
          <option value="">–</option>
          {kategorien.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
          <option value="neu">+ Neue Kategorie …</option>
        </select>
        {kategorieWahl === "neu" && (
          <input
            name="neueKategorie"
            required
            autoFocus
            placeholder="Name der Kategorie"
            aria-label="Name der neuen Kategorie"
            className={`${EINGABE} mt-2`}
          />
        )}
      </Feld>
      <Feld label="Quelle" hinweis="Datenblatt, Norm, selbst gemessen">
        <input name="quelle" defaultValue={eintrag?.quelle ?? ""} className={EINGABE} />
      </Feld>
      <Feld label="Beschreibung" className="sm:col-span-2">
        <textarea name="beschreibung" rows={3} defaultValue={eintrag?.beschreibung ?? ""} className={TEXTFELD} />
      </Feld>
      <Feld label="Druckhinweis" hinweis="erprobte Zugaben und Toleranzen" className="sm:col-span-2">
        <textarea
          name="druckhinweis"
          rows={2}
          defaultValue={eintrag?.druckhinweis ?? ""}
          placeholder="z. B. Bohrung +0,3 mm bei PETG"
          className={TEXTFELD}
        />
      </Feld>
      <Feld label="Schlagworte" hinweis="für die Suche" className="sm:col-span-2">
        <input name="schlagworte" defaultValue={eintrag?.schlagworte ?? ""} placeholder="DMX, XLR, Einbau" className={EINGABE} />
      </Feld>

      <div className="space-y-3 sm:col-span-2">
        <Fehler text={zustand.fehler} />
        <button disabled={laeuft} className={KNOPF}>
          {laeuft ? "Speichern …" : eintrag ? "Speichern" : "Speichern und weiter zu den Maßen"}
        </button>
      </div>
    </form>
  );
}
