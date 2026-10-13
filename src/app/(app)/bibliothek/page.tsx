import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/platzhalter-seite";

export const metadata: Metadata = { title: "Maßbibliothek" };

export default function Bibliothek() {
  return (
    <PlatzhalterSeite
      titel="Maßbibliothek"
      text="Standardmaße für den Alltag."
      leerTitel="Noch keine Einträge"
      leerText="Die Maßbibliothek folgt in Phase 1b."
    />
  );
}
