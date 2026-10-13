"use client";

import { useActionState } from "react";
import type { Auftrag } from "@prisma/client";
import { datumFuerEingabe, stundenFuerEingabe, zahlFuerEingabe } from "@/lib/format";
import type { FormZustand } from "@/lib/typen";
import { AUFTRAG_STATUS, MATERIALIEN, PRIORITAETEN, UMFANG } from "@/lib/werte";
import { auftragSpeichern } from "@/server/auftraege";
import { EINGABE, Fehler, Feld, KNOPF, TEXTFELD } from "@/components/ui/formular";

type Auswahl = { id: number; name: string };

export function AuftragFormular({
  auftrag,
  stuecke,
  abteilungen,
  stueckVorauswahl,
}: {
  auftrag?: Auftrag;
  stuecke: Auswahl[];
  abteilungen: Auswahl[];
  stueckVorauswahl?: number;
}) {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(auftragSpeichern, {});
  const a = auftrag;
  const dezimal = { inputMode: "decimal" as const, className: EINGABE };

  return (
    <form action={aktion} className="space-y-6">
      {a && <input type="hidden" name="id" value={a.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Feld label="Titel" className="sm:col-span-2">
          <input name="titel" required defaultValue={a?.titel} placeholder="Was wird gebraucht?" className={EINGABE} />
        </Feld>
        <Feld label="Stück">
          <select name="stueckId" defaultValue={a?.stueckId ?? stueckVorauswahl ?? ""} className={EINGABE}>
            <option value="">Allgemein (ohne Stück)</option>
            {stuecke.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Feld>
        <Feld label="Abteilung">
          <select name="abteilungId" defaultValue={a?.abteilungId ?? ""} className={EINGABE}>
            <option value="">–</option>
            {abteilungen.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Feld>
        <Feld label="Priorität">
          <select name="prioritaet" defaultValue={a?.prioritaet ?? "MITTEL"} className={EINGABE}>
            {Object.entries(PRIORITAETEN).map(([wert, name]) => (
              <option key={wert} value={wert}>
                {name}
              </option>
            ))}
          </select>
        </Feld>
        <Feld label="Deadline">
          <input name="faelligAm" type="date" defaultValue={datumFuerEingabe(a?.faelligAm)} className={EINGABE} />
        </Feld>
        <Feld label="Beschreibung" className="sm:col-span-2">
          <textarea name="beschreibung" rows={3} defaultValue={a?.beschreibung ?? ""} className={TEXTFELD} />
        </Feld>
      </div>

      {/* Beim Anlegen am Handy eingeklappt: erst das Nötigste, der Rest später. */}
      <details open={Boolean(a)} className="rounded-xl border border-linie bg-flaeche">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Mehr Angaben</summary>
        <div className="grid gap-4 border-t border-linie p-4 sm:grid-cols-2">
          <Feld label="Status">
            <select name="status" defaultValue={a?.status ?? "ANGEFRAGT"} className={EINGABE}>
              {Object.entries(AUFTRAG_STATUS).map(([wert, name]) => (
                <option key={wert} value={wert}>
                  {name}
                </option>
              ))}
            </select>
          </Feld>
          <Feld label="Umfang">
            <select name="umfang" defaultValue={a?.umfang ?? "KONSTRUKTION_UND_DRUCK"} className={EINGABE}>
              {Object.entries(UMFANG).map(([wert, name]) => (
                <option key={wert} value={wert}>
                  {name}
                </option>
              ))}
            </select>
          </Feld>
          <Feld label="Ansprechperson">
            <input name="ansprechperson" defaultValue={a?.ansprechperson ?? ""} className={EINGABE} />
          </Feld>
          <Feld label="Erhalten am">
            <input
              name="erhaltenAm"
              type="date"
              defaultValue={datumFuerEingabe(a?.erhaltenAm ?? new Date())}
              className={EINGABE}
            />
          </Feld>
          <Feld label="Anzahl Teile">
            <input name="stueckzahl" inputMode="numeric" defaultValue={a?.stueckzahl ?? 1} className={EINGABE} />
          </Feld>
          <Feld label="Material">
            <select name="material" defaultValue={a?.material ?? ""} className={EINGABE}>
              <option value="">–</option>
              {MATERIALIEN.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Feld>
          <Feld label="Farbe">
            <input name="farbe" defaultValue={a?.farbe ?? ""} placeholder="z. B. Schwarz matt" className={EINGABE} />
          </Feld>
          <Feld label="Nachbearbeitung">
            <input
              name="nachbearbeitung"
              defaultValue={a?.nachbearbeitung ?? ""}
              placeholder="schleifen, lackieren …"
              className={EINGABE}
            />
          </Feld>

          <Feld label="Filament geschätzt" hinweis="g">
            <input name="filamentGeschaetztG" defaultValue={zahlFuerEingabe(a?.filamentGeschaetztG)} {...dezimal} />
          </Feld>
          <Feld label="Filament tatsächlich" hinweis="g">
            <input name="filamentTatsaechlichG" defaultValue={zahlFuerEingabe(a?.filamentTatsaechlichG)} {...dezimal} />
          </Feld>
          <Feld label="Druckzeit geschätzt" hinweis="Stunden">
            <input
              name="druckzeitGeschaetztH"
              defaultValue={stundenFuerEingabe(a?.druckzeitGeschaetztMin)}
              {...dezimal}
            />
          </Feld>
          <Feld label="Druckzeit tatsächlich" hinweis="Stunden">
            <input
              name="druckzeitTatsaechlichH"
              defaultValue={stundenFuerEingabe(a?.druckzeitTatsaechlichMin)}
              {...dezimal}
            />
          </Feld>

          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <Feld label="Länge" hinweis="mm">
              <input name="laengeMm" defaultValue={zahlFuerEingabe(a?.laengeMm)} {...dezimal} />
            </Feld>
            <Feld label="Breite" hinweis="mm">
              <input name="breiteMm" defaultValue={zahlFuerEingabe(a?.breiteMm)} {...dezimal} />
            </Feld>
            <Feld label="Höhe" hinweis="mm">
              <input name="hoeheMm" defaultValue={zahlFuerEingabe(a?.hoeheMm)} {...dezimal} />
            </Feld>
          </div>
        </div>
      </details>

      <div className="space-y-3">
        <Fehler text={zustand.fehler} />
        <button disabled={laeuft} className={KNOPF}>
          {laeuft ? "Speichern …" : a ? "Speichern" : "Speichern und weiter zu Fotos & Maßen"}
        </button>
      </div>
    </form>
  );
}
