import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { Seitenkopf } from "@/components/ui/seite";
import { DruckerListe } from "@/components/drucker-liste";

export const metadata: Metadata = { title: "Drucker" };

export default async function DruckerSeite() {
  await erfordereBenutzer();
  const drucker = await db.drucker.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <Seitenkopf titel="Drucker" text="Anlegen und Bearbeiten folgt in Phase 2." />
      <DruckerListe drucker={drucker} />
    </>
  );
}
