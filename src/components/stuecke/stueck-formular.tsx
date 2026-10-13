"use client";

import { useActionState } from "react";
import type { Stueck } from "@prisma/client";
import { datumFuerEingabe } from "@/lib/format";
import type { FormZustand } from "@/lib/typen";
import { SPARTEN, STUECK_STATUS } from "@/lib/werte";
import { stueckSpeichern } from "@/server/stuecke";
import { EINGABE, Fehler, Feld, KNOPF, TEXTFELD } from "@/components/ui/formular";

export function StueckFormular({ stueck }: { stueck?: Stueck }) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(stueckSpeichern, {});

  return (
    <form action={aktion} className="grid gap-4 sm:grid-cols-2">
      {stueck && <input type="hidden" name="id" value={stueck.id} />}

      <Feld label="Titel" className="sm:col-span-2">
        <input name="titel" required defaultValue={stueck?.titel} placeholder="z. B. Otello" className={EINGABE} />
      </Feld>
      <Feld label="Sparte">
        <select name="sparte" defaultValue={stueck?.sparte ?? ""} className={EINGABE}>
          <option value="">–</option>
          {SPARTEN.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Feld>
      <Feld label="Status">
        <select name="status" defaultValue={stueck?.status ?? "AKTIV"} className={EINGABE}>
          {Object.entries(STUECK_STATUS).map(([wert, name]) => (
            <option key={wert} value={wert}>
              {name}
            </option>
          ))}
        </select>
      </Feld>
      <Feld label="Spielzeit">
        <input name="spielzeit" defaultValue={stueck?.spielzeit ?? ""} placeholder="2026/27" className={EINGABE} />
      </Feld>
      <Feld label="Premiere">
        <input name="premiere" type="date" defaultValue={datumFuerEingabe(stueck?.premiere)} className={EINGABE} />
      </Feld>
      <Feld label="Spielstätte">
        <input name="spielstaette" defaultValue={stueck?.spielstaette ?? ""} placeholder="Opernhaus" className={EINGABE} />
      </Feld>
      <Feld label="Ansprechpersonen">
        <input name="ansprechpersonen" defaultValue={stueck?.ansprechpersonen ?? ""} className={EINGABE} />
      </Feld>
      <Feld label="Notizen" className="sm:col-span-2">
        <textarea name="notizen" rows={4} defaultValue={stueck?.notizen ?? ""} className={TEXTFELD} />
      </Feld>

      <div className="space-y-3 sm:col-span-2">
        <Fehler text={zustand.fehler} />
        <button disabled={laeuft} className={KNOPF}>
          {laeuft ? "Speichern …" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
