export function Seitenkopf({ titel, text, aktion }: { titel: string; text?: string; aktion?: React.ReactNode }) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{titel}</h1>
        {text && <p className="mt-1 text-sm text-gedaempft">{text}</p>}
      </div>
      {aktion}
    </header>
  );
}

export function Karte({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-linie bg-flaeche ${className}`}>{children}</section>;
}

export function Leerzustand({ titel, text }: { titel: string; text: string }) {
  return (
    <Karte className="px-6 py-12 text-center">
      <p className="font-medium">{titel}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-gedaempft">{text}</p>
    </Karte>
  );
}

export function Chip({ children, farbe }: { children: React.ReactNode; farbe?: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-linie px-2.5 py-0.5 text-xs text-gedaempft">
      {farbe && <span className="size-2 rounded-full" style={{ backgroundColor: farbe }} />}
      {children}
    </span>
  );
}
