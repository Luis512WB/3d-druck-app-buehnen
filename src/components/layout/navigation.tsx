"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Punkt = {
  href: string;
  name: string;
  symbol: string;
  nurDesktop?: boolean;
  nurMobil?: boolean;
};

const PUNKTE: Punkt[] = [
  { href: "/", name: "Übersicht", symbol: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" },
  { href: "/stuecke", name: "Stücke", symbol: "M4 5h16v11H4zM8 20h8M12 16v4" },
  { href: "/auftraege", name: "Aufträge", symbol: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" },
  { href: "/bibliothek", name: "Maße", symbol: "M3 9h18v6H3zM7 9v3M11 9v3M15 9v3M19 9v3" },
  { href: "/planung", name: "Planung", symbol: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4", nurDesktop: true },
  { href: "/drucker", name: "Drucker", symbol: "M5 4h14v5H5zM3 9h18v8H3zM7 17h10v3H7z", nurDesktop: true },
  { href: "/einstellungen", name: "Einstellungen", symbol: "M4 7h10M18 7h2M4 17h2M10 17h10M16 5v4M8 15v4", nurDesktop: true },
  { href: "/mehr", name: "Mehr", symbol: "M5 12h.01M12 12h.01M19 12h.01", nurMobil: true },
];

// Bereiche, die am Handy unter „Mehr“ liegen
const MEHR_BEREICHE = ["/planung", "/drucker", "/einstellungen", "/mehr"];

function istAktiv(pfad: string, href: string) {
  if (href === "/") return pfad === "/";
  if (href === "/mehr") return MEHR_BEREICHE.some((b) => pfad.startsWith(b));
  return pfad.startsWith(href);
}

function Symbol({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export function Navigation({ fuss }: { fuss?: React.ReactNode }) {
  const pfad = usePathname();

  return (
    <>
      {/* Desktop: Seitenleiste */}
      <nav className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-linie bg-flaeche px-3 py-5 md:flex">
        <div className="px-3 pb-5 text-sm font-semibold tracking-tight">3D-Druck Bühnen</div>
        <ul className="flex flex-1 flex-col gap-1">
          {PUNKTE.filter((p) => !p.nurMobil).map((p) => {
            const aktiv = istAktiv(pfad, p.href);
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={aktiv ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    aktiv
                      ? "bg-akzent-zart font-medium text-akzent"
                      : "text-gedaempft hover:bg-hintergrund hover:text-schrift"
                  }`}
                >
                  <Symbol d={p.symbol} />
                  {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {fuss}
      </nav>

      {/* Handy: Leiste unten */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-linie bg-flaeche pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-5">
          {PUNKTE.filter((p) => !p.nurDesktop).map((p) => {
            const aktiv = istAktiv(pfad, p.href);
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={aktiv ? "page" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] ${
                    aktiv ? "font-medium text-akzent" : "text-gedaempft"
                  }`}
                >
                  <Symbol d={p.symbol} />
                  {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
