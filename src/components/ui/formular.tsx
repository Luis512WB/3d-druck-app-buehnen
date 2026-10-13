// Gemeinsame Formularbausteine. 16 px Schrift in Eingabefeldern verhindert das Hineinzoomen auf iOS.

export const EINGABE =
  "block h-11 w-full rounded-lg border border-linie bg-flaeche px-3 text-base outline-none focus:border-akzent";
export const TEXTFELD =
  "block w-full rounded-lg border border-linie bg-flaeche px-3 py-2.5 text-base outline-none focus:border-akzent";
export const KNOPF =
  "inline-flex h-11 items-center justify-center rounded-lg bg-akzent px-5 text-sm font-medium text-akzent-schrift disabled:opacity-60";
export const KNOPF_ZWEIT =
  "inline-flex h-11 items-center justify-center rounded-lg border border-linie bg-flaeche px-4 text-sm font-medium disabled:opacity-60";
export const KNOPF_KLEIN =
  "inline-flex h-9 items-center justify-center rounded-lg border border-linie bg-flaeche px-3 text-sm disabled:opacity-60";

export function Feld({
  label,
  hinweis,
  className = "",
  children,
}: {
  label: string;
  hinweis?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm font-medium ${className}`}>
      {label}
      {hinweis && <span className="ml-1.5 font-normal text-gedaempft">{hinweis}</span>}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export function Fehler({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p role="alert" className="text-sm text-red-600 dark:text-red-400">
      {text}
    </p>
  );
}

export function Abschnitt({
  titel,
  aktion,
  children,
}: {
  titel: string;
  aktion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-gedaempft">{titel}</h2>
        {aktion}
      </div>
      {children}
    </section>
  );
}
