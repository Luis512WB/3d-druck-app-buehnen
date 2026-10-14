// Erzeugt die App-Symbole (Home-Bildschirm, Android, Browser) aus dem W der Wuppertaler Bühnen.
// Aufruf: node scripts/icons-erzeugen.mjs
import sharp from "sharp";

const W = "M17.41 0l71.661 228h54.537L192.16 60.886h.705L241.065 228H295.6L367.59 0H17.41z";

// Dunkle Fläche, helles W, darunter eine schmale Linie in Petrol. iOS rundet die Ecken selbst ab.
function symbol(groesse, rand) {
  const breite = groesse * (1 - 2 * rand);
  const hoehe = (breite * 228) / 351;
  const x = (groesse - breite) / 2;
  const y = (groesse - hoehe) / 2 - groesse * 0.04;
  const linieY = y + hoehe + groesse * 0.085;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${groesse}" height="${groesse}" viewBox="0 0 ${groesse} ${groesse}">
  <rect width="${groesse}" height="${groesse}" fill="#111315"/>
  <svg x="${x}" y="${y}" width="${breite}" height="${hoehe}" viewBox="17 0 351 228"><path fill="#e7e5e0" d="${W}"/></svg>
  <rect x="${groesse * 0.36}" y="${linieY}" width="${groesse * 0.28}" height="${Math.max(2, groesse * 0.028)}" fill="#4fc1b0"/>
</svg>`;
}

const ziele = [
  ["apple-touch-icon.png", 180, 0.2],
  ["icon-192.png", 192, 0.2],
  ["icon-512.png", 512, 0.2],
  ["icon-maskable-512.png", 512, 0.27], // mehr Rand: Android schneidet bei „maskable“ einen Kreis aus
];
for (const ordner of ["vorschau/icons", "public/icons"]) {
  for (const [name, groesse, rand] of ziele) {
    await sharp(Buffer.from(symbol(groesse, rand))).png().toFile(`${ordner}/${name}`);
  }
}
console.log("Symbole erzeugt.");
