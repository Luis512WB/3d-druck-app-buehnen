// Liefert den Ordner vorschau/ lokal aus, um die GitHub-Pages-Version vor dem Hochladen anzusehen.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

const port = Number(process.env.PORT) || 4173;
const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
};
const wurzel = new URL("../vorschau/", import.meta.url);

createServer(async (anfrage, antwort) => {
  let pfad = decodeURIComponent(new URL(anfrage.url, "http://x").pathname).slice(1);
  if (pfad === "" || pfad.endsWith("/")) pfad += "index.html";
  if (pfad.split("/").includes("..")) return antwort.writeHead(400).end();
  try {
    const inhalt = await readFile(new URL(pfad, wurzel));
    antwort.writeHead(200, { "Content-Type": TYPEN[extname(pfad)] ?? "application/octet-stream" }).end(inhalt);
  } catch {
    antwort.writeHead(404).end("Nicht gefunden");
  }
}).listen(port, () => console.log(`Vorschau: http://localhost:${port}`));
