import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "./db";
import { sitzungLesen } from "./sitzung";
import type { Rolle } from "./werte";

export type AngemeldeterBenutzer = {
  id: number;
  name: string;
  email: string;
  rolle: Rolle;
};

// cache(): pro Anfrage nur eine Sitzungsprüfung, auch wenn mehrere Stellen danach fragen.
export const aktuellerBenutzer = cache(async (): Promise<AngemeldeterBenutzer | null> => {
  const id = await sitzungLesen();
  if (!id) return null;
  const benutzer = await db.benutzer.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, rolle: true, aktiv: true },
  });
  if (!benutzer || !benutzer.aktiv) return null;
  return {
    id: benutzer.id,
    name: benutzer.name,
    email: benutzer.email,
    rolle: benutzer.rolle as Rolle,
  };
});

// Jede Seite und jede Server Action ruft das auf – Layouts allein schützen nicht.
export async function erfordereBenutzer(...rollen: Rolle[]): Promise<AngemeldeterBenutzer> {
  const benutzer = await aktuellerBenutzer();
  if (!benutzer) redirect("/login");
  if (rollen.length > 0 && !rollen.includes(benutzer.rolle)) redirect("/");
  return benutzer;
}
