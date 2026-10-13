import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Alle Dateien liegen unter data/uploads; in der Datenbank steht nur der relative Pfad.
const WURZEL = path.join(process.cwd(), "data", "uploads");

const CAD = ["step", "stp", "f3d", "f3z", "stl", "3mf", "obj", "iges", "igs", "dxf", "dwg", "scad"];
const SLICER = ["gcode", "bgcode"];
const DOKUMENT = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];

function artVon(dateiname: string, mimeTyp: string) {
  const endung = dateiname.split(".").pop()?.toLowerCase() ?? "";
  if (mimeTyp.startsWith("image/")) return "BILD";
  if (CAD.includes(endung)) return "CAD";
  if (SLICER.includes(endung)) return "SLICER";
  if (DOKUMENT.includes(endung)) return "DOKUMENT";
  return "SONSTIGES";
}

function absolut(relativ: string) {
  const ziel = path.resolve(WURZEL, relativ);
  if (!ziel.startsWith(WURZEL + path.sep)) throw new Error("Ungültiger Dateipfad.");
  return ziel;
}

export const miniPfad = (vorschauPfad: string) => vorschauPfad.replace("-vorschau.webp", "-mini.webp");

export async function dateiSpeichern(datei: File, ordner: string) {
  const kennung = randomUUID();
  const sichererName = datei.name.replace(/[^\w.\- ]+/g, "_").slice(-120) || "datei";
  const verzeichnis = path.posix.join(String(new Date().getFullYear()), ordner);
  await mkdir(absolut(verzeichnis), { recursive: true });

  const inhalt = Buffer.from(await datei.arrayBuffer());
  const pfad = path.posix.join(verzeichnis, `${kennung}-${sichererName}`);
  await writeFile(absolut(pfad), inhalt);

  const art = artVon(datei.name, datei.type);
  let vorschauPfad: string | null = null;
  if (art === "BILD") {
    const ziel = path.posix.join(verzeichnis, `${kennung}-vorschau.webp`);
    try {
      // rotate() übernimmt die Ausrichtung aus den Handy-Metadaten.
      const bild = sharp(inhalt).rotate();
      await bild
        .clone()
        .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(absolut(ziel));
      await bild.clone().resize(480, 480, { fit: "cover" }).webp({ quality: 75 }).toFile(absolut(miniPfad(ziel)));
      vorschauPfad = ziel;
    } catch {
      // Format, das sharp nicht lesen kann: Das Original bleibt trotzdem abrufbar.
    }
  }

  return {
    art,
    dateiname: datei.name,
    pfad,
    vorschauPfad,
    mimeTyp: datei.type || "application/octet-stream",
    groesseBytes: inhalt.length,
  };
}

export const dateiLesen = (relativ: string) => readFile(absolut(relativ));

export async function dateienLoeschen(anhang: { pfad: string; vorschauPfad: string | null }) {
  const pfade = [anhang.pfad];
  if (anhang.vorschauPfad) pfade.push(anhang.vorschauPfad, miniPfad(anhang.vorschauPfad));
  await Promise.all(pfade.map((p) => rm(absolut(p), { force: true })));
}
