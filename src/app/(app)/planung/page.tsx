import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/platzhalter-seite";

export const metadata: Metadata = { title: "Planung" };

export default function Planung() {
  return (
    <PlatzhalterSeite
      titel="Planung"
      text="Welcher Druck läuft wann auf welchem Drucker."
      leerTitel="Noch nichts geplant"
      leerText="Die Druckerplanung folgt in Phase 2."
    />
  );
}
