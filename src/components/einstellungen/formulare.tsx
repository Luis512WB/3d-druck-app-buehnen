"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormZustand } from "@/lib/typen";
import { abteilungAnlegen, kategorieAnlegen, passwortAendern } from "@/server/einstellungen";
import { EINGABE, Fehler, Feld, KNOPF_ZWEIT } from "@/components/ui/formular";

type Aktion = (zustand: FormZustand, formData: FormData) => Promise<FormZustand>;

function NameAnlegen({ aktion, platzhalter }: { aktion: Aktion; platzhalter: string }) {
  const [zustand, absenden, laeuft] = useActionState<FormZustand, FormData>(aktion, {});
  const formular = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (zustand.ok) formular.current?.reset();
  }, [zustand]);

  return (
    <form ref={formular} action={absenden} className="space-y-2">
      <div className="flex gap-2">
        <input name="name" required placeholder={platzhalter} aria-label={platzhalter} className={EINGABE} />
        <button disabled={laeuft} className={`${KNOPF_ZWEIT} shrink-0`}>
          Hinzufügen
        </button>
      </div>
      <Fehler text={zustand.fehler} />
    </form>
  );
}

export const AbteilungAnlegen = () => <NameAnlegen aktion={abteilungAnlegen} platzhalter="Neue Abteilung" />;
export const KategorieAnlegen = () => <NameAnlegen aktion={kategorieAnlegen} platzhalter="Neue Kategorie" />;

export function PasswortAendern() {
  const [zustand, absenden, laeuft] = useActionState<FormZustand, FormData>(passwortAendern, {});
  const formular = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (zustand.ok) formular.current?.reset();
  }, [zustand]);

  return (
    <form ref={formular} action={absenden} className="grid gap-3 sm:grid-cols-2">
      <Feld label="Bisheriges Passwort">
        <input name="alt" type="password" required autoComplete="current-password" className={EINGABE} />
      </Feld>
      <Feld label="Neues Passwort" hinweis="mind. 8 Zeichen">
        <input name="neu" type="password" required minLength={8} autoComplete="new-password" className={EINGABE} />
      </Feld>
      <div className="space-y-2 sm:col-span-2">
        <button disabled={laeuft} className={KNOPF_ZWEIT}>
          Passwort ändern
        </button>
        <Fehler text={zustand.fehler} />
        {zustand.ok && <p className="text-sm text-akzent">Passwort geändert.</p>}
      </div>
    </form>
  );
}
