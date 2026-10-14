export function Seitenkopf({ titel, text, aktion }: { titel: string; text?: string; aktion?: React.ReactNode }) {
  return (
    <header className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{titel}</h1>
        {text && <p className="mt-1 text-sm text-gedaempft">{text}</p>}
      </div>
      {aktion}
    </header>
  );
}

export function Karte({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-linie bg-flaeche ${className}`}>{children}</section>;
}

export function Leerzustand({ titel, text }: { titel: string; text: string }) {
  return (
    <Karte className="px-6 py-10 text-center">
      <p className="font-semibold">{titel}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-gedaempft">{text}</p>
    </Karte>
  );
}

// Kennzeichen für Status, Priorität und Ähnliches: eckig, Maschinenschrift, Farbe nur als kleines Quadrat.
export function Chip({ children, farbe }: { children: React.ReactNode; farbe?: string | null }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[3px] border border-linie bg-flaeche px-2 font-mono text-[11px] font-medium uppercase tracking-wide text-schrift">
      {farbe && <span className="size-[7px] rounded-[1px]" style={{ backgroundColor: farbe }} />}
      {children}
    </span>
  );
}

// Nebensächliche Angaben (Material, Gramm): ohne Großbuchstaben, gedämpft.
export function Merkmal({ children, farbe }: { children: React.ReactNode; farbe?: string | null }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[3px] border border-linie-2 bg-flaeche-2 px-2 font-mono text-[11px] text-gedaempft">
      {farbe && <span className="size-2 rounded-full border border-gedaempft-2/50" style={{ backgroundColor: farbe }} />}
      {children}
    </span>
  );
}
