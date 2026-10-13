"use client";

import { useActionState } from "react";
import { anmelden, type AnmeldeZustand } from "@/server/anmeldung";

const FELD =
  "mt-1 block h-11 w-full rounded-lg border border-linie bg-flaeche px-3 text-base outline-none focus:border-akzent";

export function AnmeldeFormular() {
  const [zustand, aktion, laeuft] = useActionState<AnmeldeZustand, FormData>(anmelden, {});

  return (
    <form action={aktion} className="space-y-4">
      <label className="block text-sm font-medium">
        E-Mail
        <input name="email" type="email" autoComplete="username" required className={FELD} />
      </label>
      <label className="block text-sm font-medium">
        Passwort
        <input name="passwort" type="password" autoComplete="current-password" required className={FELD} />
      </label>

      {zustand.fehler && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {zustand.fehler}
        </p>
      )}

      <button
        disabled={laeuft}
        className="h-11 w-full rounded-lg bg-akzent font-medium text-akzent-schrift disabled:opacity-60"
      >
        {laeuft ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}
