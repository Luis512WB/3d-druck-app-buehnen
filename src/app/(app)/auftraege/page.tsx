import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/platzhalter-seite";

export const metadata: Metadata = { title: "Aufträge" };

export default function Auftraege() {
  return (
    <PlatzhalterSeite
      titel="Aufträge"
      text="Alle 3D-Druck-Aufträge."
      leerTitel="Noch keine Aufträge"
      leerText="Das Anlegen von Aufträgen folgt in Phase 1."
    />
  );
}
