import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/platzhalter-seite";

export const metadata: Metadata = { title: "Stücke" };

export default function Stuecke() {
  return (
    <PlatzhalterSeite
      titel="Stücke"
      text="Produktionen, zu denen Aufträge gehören."
      leerTitel="Noch keine Stücke"
      leerText="Das Anlegen von Stücken folgt in Phase 1."
    />
  );
}
