import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { Seitenkopf } from "@/components/ui/seite";
import { StueckFormular } from "@/components/stuecke/stueck-formular";

export const metadata: Metadata = { title: "Neues Stück" };

export default async function NeuesStueck() {
  await erfordereBenutzer("ADMIN", "BEARBEITER");

  return (
    <>
      <Seitenkopf titel="Neues Stück" />
      <StueckFormular />
    </>
  );
}
