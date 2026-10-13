import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLLEN } from "@/lib/werte";
import { Chip, Karte, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Einstellungen" };

export default async function Einstellungen() {
  const benutzer = await erfordereBenutzer();
  const abteilungen = await db.abteilung.findMany({ where: { aktiv: true }, orderBy: { name: "asc" } });

  return (
    <>
      <Seitenkopf titel="Einstellungen" />

      <h2 className="mb-3 text-sm font-medium text-gedaempft">Angemeldet als</h2>
      <Karte className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <div className="font-medium">{benutzer.name}</div>
          <div className="text-sm text-gedaempft">{benutzer.email}</div>
        </div>
        <Chip>{ROLLEN[benutzer.rolle]}</Chip>
      </Karte>

      <h2 className="mt-8 mb-3 text-sm font-medium text-gedaempft">Abteilungen</h2>
      <Karte className="flex flex-wrap gap-2 p-5">
        {abteilungen.map((a) => (
          <Chip key={a.id} farbe={a.farbeHex}>
            {a.name}
          </Chip>
        ))}
      </Karte>
      <p className="mt-2 text-sm text-gedaempft">Abteilungen anlegen und bearbeiten folgt in Phase 1.</p>
    </>
  );
}
