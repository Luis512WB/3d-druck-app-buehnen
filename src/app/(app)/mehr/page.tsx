import type { Metadata } from "next";
import Link from "next/link";
import { erfordereBenutzer } from "@/lib/auth";
import { abmelden } from "@/server/anmeldung";
import { Karte, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Mehr" };

const BEREICHE = [
  { href: "/planung", name: "Planung", text: "Druckerbelegung" },
  { href: "/drucker", name: "Drucker", text: "Geräte und Bauräume" },
  { href: "/einstellungen", name: "Einstellungen", text: "Abteilungen, Benutzer" },
];

export default async function Mehr() {
  await erfordereBenutzer();

  return (
    <>
      <Seitenkopf titel="Mehr" />
      <Karte className="divide-y divide-linie">
        {BEREICHE.map((b) => (
          <Link key={b.href} href={b.href} className="flex min-h-14 items-center justify-between px-5 py-3">
            <span>
              <span className="block font-medium">{b.name}</span>
              <span className="block text-sm text-gedaempft">{b.text}</span>
            </span>
            <span aria-hidden className="text-gedaempft">
              ›
            </span>
          </Link>
        ))}
      </Karte>

      <form action={abmelden} className="mt-6">
        <button className="min-h-11 w-full rounded-xl border border-linie bg-flaeche px-5 text-sm font-medium">
          Abmelden
        </button>
      </form>
    </>
  );
}
