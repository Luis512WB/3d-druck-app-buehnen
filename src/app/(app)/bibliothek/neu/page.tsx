import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { EintragFormular } from "@/components/bibliothek/eintrag-formular";
import { Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Neuer Eintrag" };

export default async function NeuerEintrag() {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const kategorien = await db.bibliothekskategorie.findMany({ orderBy: { reihenfolge: "asc" } });

  return (
    <>
      <Seitenkopf titel="Neuer Eintrag" text="Maße, Bilder und Dateien kommen im nächsten Schritt." />
      <EintragFormular kategorien={kategorien} />
    </>
  );
}
