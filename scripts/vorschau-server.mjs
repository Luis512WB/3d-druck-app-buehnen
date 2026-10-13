// Liefert vorschau/index.html lokal aus, um die GitHub-Pages-Version vor dem Hochladen anzusehen.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const port = Number(process.env.PORT) || 4173;
createServer(async (_, antwort) => {
  antwort.setHeader("Content-Type", "text/html; charset=utf-8");
  antwort.end(await readFile(new URL("../vorschau/index.html", import.meta.url)));
}).listen(port, () => console.log(`Vorschau: http://localhost:${port}`));
