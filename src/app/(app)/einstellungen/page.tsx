import type { Metadata } from "next";
import { erfordereBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLLEN } from "@/lib/werte";
import { cookies } from "next/headers";
import { DARSTELLUNGEN } from "@/lib/werte";
import { abteilungAusblenden, darstellungSetzen } from "@/server/einstellungen";
import { AbteilungAnlegen, KategorieAnlegen, PasswortAendern } from "@/components/einstellungen/formulare";
import { Abschnitt } from "@/components/ui/formular";
import { BestaetigenKnopf } from "@/components/ui/knoepfe";
import { Chip, Karte, Seitenkopf } from "@/components/ui/seite";

export const metadata: Metadata = { title: "Einstellungen" };

export default async function Einstellungen() {
  const benutzer = await erfordereBenutzer();
  const [abteilungen, kategorien] = await Promise.all([
    db.abteilung.findMany({ where: { aktiv: true }, orderBy: { name: "asc" } }),
    db.bibliothekskategorie.findMany({ orderBy: { reihenfolge: "asc" } }),
  ]);
  const istAdmin = benutzer.rolle === "ADMIN";
  const darstellung = (await cookies()).get("darstellung")?.value ?? "dunkel";

  return (
    <>
      <Seitenkopf titel="Einstellungen" />

      <h2 className="mb-3 text-sm font-medium text-gedaempft">Angemeldet als</h2>
      <Karte>
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <div className="font-medium">{benutzer.name}</div>
            <div className="truncate text-sm text-gedaempft">{benutzer.email}</div>
          </div>
          <Chip>{ROLLEN[benutzer.rolle]}</Chip>
        </div>
        <div className="border-t border-linie p-4">
          <PasswortAendern />
        </div>
      </Karte>

      <Abschnitt titel="Darstellung">
        <form action={darstellungSetzen} className="grid grid-cols-3 overflow-hidden rounded-[5px] border border-linie">
          {Object.entries(DARSTELLUNGEN).map(([wert, name]) => (
            <button
              key={wert}
              name="darstellung"
              value={wert}
              aria-pressed={darstellung === wert}
              className={`h-11 text-sm font-semibold [&+&]:border-l [&+&]:border-linie ${
                darstellung === wert ? "bg-schrift text-hintergrund" : "bg-flaeche text-gedaempft hover:text-schrift"
              }`}
            >
              {name}
            </button>
          ))}
        </form>
      </Abschnitt>

      <Abschnitt titel="Abteilungen">
        <Karte className="space-y-4 p-4">
          <ul className="flex flex-wrap gap-2">
            {abteilungen.map((a) => (
              <li key={a.id} className="inline-flex items-center gap-1.5 rounded-[3px] border border-linie py-0.5 pr-1 pl-2.5 text-sm">
                <span className="size-[7px] rounded-[1px]" style={{ backgroundColor: a.farbeHex ?? "#6B7280" }} />
                {a.name}
                {istAdmin && (
                  <form action={abteilungAusblenden}>
                    <input type="hidden" name="id" value={a.id} />
                    <BestaetigenKnopf
                      frage={`Abteilung „${a.name}“ ausblenden? Bestehende Aufträge behalten sie.`}
                      className="grid size-7 place-items-center rounded-[3px] text-gedaempft hover:text-warnung"
                    >
                      ✕
                    </BestaetigenKnopf>
                  </form>
                )}
              </li>
            ))}
          </ul>
          {istAdmin && <AbteilungAnlegen />}
        </Karte>
      </Abschnitt>

      <Abschnitt titel="Kategorien der Maßbibliothek">
        <Karte className="space-y-4 p-4">
          <ul className="flex flex-wrap gap-2">
            {kategorien.map((k) => (
              <li key={k.id}>
                <Chip>{k.name}</Chip>
              </li>
            ))}
          </ul>
          <KategorieAnlegen />
        </Karte>
      </Abschnitt>
    </>
  );
}
