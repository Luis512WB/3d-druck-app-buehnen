// Gemeinsame Formularbausteine. 16 px Schrift in Eingabefeldern verhindert das Hineinzoomen auf iOS.

export const EINGABE =
  "block h-11 w-full rounded-[5px] border border-linie bg-flaeche px-3 text-base outline-none placeholder:text-gedaempft-2 focus:border-akzent focus:outline-1 focus:-outline-offset-1 focus:outline-akzent";
export const TEXTFELD =
  "block w-full rounded-[5px] border border-linie bg-flaeche px-3 py-2.5 text-base outline-none placeholder:text-gedaempft-2 focus:border-akzent focus:outline-1 focus:-outline-offset-1 focus:outline-akzent";
export const KNOPF =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-akzent px-5 text-sm font-semibold text-akzent-schrift hover:bg-akzent-2 active:translate-y-px disabled:opacity-60";
export const KNOPF_ZWEIT =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[5px] border border-linie bg-flaeche px-4 text-sm font-semibold hover:border-gedaempft-2 active:translate-y-px disabled:opacity-60";
export const KNOPF_KLEIN =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[5px] border border-linie bg-flaeche px-3 text-sm font-medium hover:border-gedaempft-2 active:translate-y-px disabled:opacity-60";

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
    <label className={`block text-[13px] font-semibold text-gedaempft ${className}`}>
      {label}
      {hinweis && <span className="ml-1.5 font-mono text-[11px] font-normal text-gedaempft-2">{hinweis}</span>}
      <span className="mt-1 block font-normal text-schrift">{children}</span>
    </label>
  );
}

export function Fehler({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p role="alert" className="text-sm text-warnung">
      {text}
    </p>
  );
}

// Abschnittsüberschrift mit durchlaufender Linie, wie auf einem technischen Zettel.
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
    <section className="mt-7">
      <div className="mb-2.5 flex items-center gap-3">
        <h2 className="flex flex-1 items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gedaempft after:h-px after:flex-1 after:bg-linie">
          {titel}
        </h2>
        {aktion}
      </div>
      {children}
    </section>
  );
}
