import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { EintragFormular } from "@/components/bibliothek/eintrag-formular";
import { Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Eintrag bearbeiten" };

export default async function EintragBearbeiten({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const [eintrag, kategorien] = await Promise.all([
    db.bibliothekseintrag.findUnique({ where: { id: Number((await params).id) || 0 } }),
    db.bibliothekskategorie.findMany({ orderBy: { reihenfolge: "asc" } }),
  ]);
  if (!eintrag) notFound();

  return (
    <>
      <Seitenkopf titel="Eintrag bearbeiten" text={eintrag.titel} />
      <EintragFormular eintrag={eintrag} kategorien={kategorien} />
    </>
  );
}
