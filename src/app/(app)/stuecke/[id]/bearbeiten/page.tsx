import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { Seitenkopf } from "@/components/ui/seite";
import { StueckFormular } from "@/components/stuecke/stueck-formular";

export const metadata: Metadata = { title: "Stück bearbeiten" };

export default async function StueckBearbeiten({ params }: { params: Promise<{ id: string }> }) {
  await erfordereBenutzer("ADMIN", "BEARBEITER");
  const stueck = await db.stueck.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!stueck) notFound();

  return (
    <>
      <Seitenkopf titel="Stück bearbeiten" text={stueck.titel} />
      <StueckFormular stueck={stueck} />
    </>
  );
}
