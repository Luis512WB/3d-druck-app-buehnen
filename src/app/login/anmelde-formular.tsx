"use client";

import { useActionState } from "react";
import { anmelden, type AnmeldeZustand } from "@/server/anmeldung";

const FELD =
  "mt-1 block h-11 w-full rounded-[5px] border border-linie bg-flaeche px-3 text-base outline-none focus:border-akzent";

export function AnmeldeFormular() {
  const [zustand, aktion, laeuft] = useActionState<AnmeldeZustand, FormData>(anmelden, {});

  return (
    <form action={aktion} className="space-y-4">
      <label className="block text-[13px] font-semibold text-gedaempft">
        E-Mail
        <input name="email" type="email" autoComplete="username" required className={FELD} />
      </label>
      <label className="block text-[13px] font-semibold text-gedaempft">
        Passwort
        <input name="passwort" type="password" autoComplete="current-password" required className={FELD} />
      </label>

      {zustand.fehler && (
        <p role="alert" className="text-sm text-warnung">
          {zustand.fehler}
        </p>
      )}

      <button
        disabled={laeuft}
        className="h-11 w-full rounded-[5px] bg-akzent font-semibold text-akzent-schrift hover:bg-akzent-2 disabled:opacity-60"
      >
        {laeuft ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
