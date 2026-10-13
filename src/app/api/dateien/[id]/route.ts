import type { NextRequest } from "next/server";
import { aktuellerBenutzer } from "@/lib/auth";
import { db } from "@/lib/db";
import { dateiLesen, miniPfad } from "@/lib/uploads";

// Dateien werden nur angemeldeten Nutzern ausgeliefert – data/uploads ist kein öffentlicher Ordner.
// ?g=mini | vorschau liefert die verkleinerten Bilder, sonst das Original; ?download=1 erzwingt Speichern.
export async function GET(anfrage: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await aktuellerBenutzer())) return new Response("Nicht angemeldet", { status: 401 });

  const anhang = await db.anhang.findUnique({ where: { id: Number((await params).id) || 0 } });
  if (!anhang) return new Response("Nicht gefunden", { status: 404 });

  const groesse = anfrage.nextUrl.searchParams.get("g");
  const verkleinert = anhang.vorschauPfad && (groesse === "mini" || groesse === "vorschau");
  const pfad = verkleinert
    ? groesse === "mini"
      ? miniPfad(anhang.vorschauPfad!)
      : anhang.vorschauPfad!
    : anhang.pfad;

  let inhalt: Buffer;
  try {
    inhalt = await dateiLesen(pfad);
  } catch {
    return new Response("Datei fehlt", { status: 404 });
  }

  const kopf = new Headers({
    "Content-Type": verkleinert ? "image/webp" : anhang.mimeTyp,
    "Content-Length": String(inhalt.length),
    "Cache-Control": "private, max-age=86400",
    "X-Content-Type-Options": "nosniff",
  });
  // Nur Bilder dürfen im Browser angezeigt werden; alles andere wird heruntergeladen.
  const anzeigen = verkleinert || (anhang.mimeTyp.startsWith("image/") && !anfrage.nextUrl.searchParams.has("download"));
  if (!anzeigen) {
    kopf.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(anhang.dateiname)}`);
  }

  return new Response(new Uint8Array(inhalt), { headers: kopf });
}
