// Startbestand: Abteilungen, Drucker, Bibliothekskategorien und der erste Admin.
// Mehrfach ausführbar – vorhandene Einträge werden nicht überschrieben.
import prismaPkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = prismaPkg;
const db = new PrismaClient();

const abteilungen = [
  { name: "Beleuchtung", farbeHex: "#EAB308" },
  { name: "Technik", farbeHex: "#6B7280" },
  { name: "Schreinerei", farbeHex: "#B45309" },
  { name: "Schlosserei", farbeHex: "#475569" },
  { name: "Deko", farbeHex: "#DB2777" },
  { name: "Requisite", farbeHex: "#92400E" },
  { name: "Maske", farbeHex: "#E11D48" },
  { name: "Schneiderei", farbeHex: "#7C3AED" },
  { name: "Ton", farbeHex: "#2563EB" },
];

const drucker = [
  {
    name: "Prusa XL",
    modell: "Original Prusa XL (2 Werkzeugköpfe)",
    bauraumXMm: 360,
    bauraumYMm: 360,
    bauraumZMm: 360,
    duesenMm: 0.4,
    anzahlMaterialien: 2,
  },
  {
    name: "Bambu Lab P1S",
    modell: "Bambu Lab P1S",
    bauraumXMm: 256,
    bauraumYMm: 256,
    bauraumZMm: 256,
    duesenMm: 0.4,
    anzahlMaterialien: 1,
  },
];

const kategorien = [
  "Kabelverschraubungen",
  "Steckverbinder",
  "Gewinde & Schrauben",
  "Rohre & Traversen",
  "Sonstiges",
];

for (const a of abteilungen) {
  await db.abteilung.upsert({ where: { name: a.name }, update: {}, create: a });
}

for (const d of drucker) {
  await db.drucker.upsert({ where: { name: d.name }, update: {}, create: d });
}

for (const [i, name] of kategorien.entries()) {
  await db.bibliothekskategorie.upsert({
    where: { name },
    update: {},
    create: { name, reihenfolge: i },
  });
}

// Werte aus „Dimensions & Design Guidelines – Metric Size Inserts“ von CNC Kitchen (cnckitchen.store),
// übernommen am 14.10.2026. D2 = Bohrungsdurchmesser, Sackloch mindestens L + 1 mm tief.
const CNC_EINSAETZE: [string, number, number, number, number][] = [
  ["M2 × 3", 3.0, 3.6, 3.2, 1.3], ["M2.5 × 4", 4.0, 4.6, 4.0, 1.6], ["M3 × 5.7", 5.7, 4.6, 4.0, 1.6],
  ["M3 × 3", 3.0, 4.6, 4.0, 1.6], ["M3 × 5 × 4 Voron", 4.0, 5.0, 4.4, 1.6], ["M4 × 8.1", 8.1, 6.3, 5.7, 2.1],
  ["M4 × 4", 4.0, 6.3, 5.7, 2.1], ["M5 × 9.5", 9.5, 7.1, 6.5, 2.6], ["M5 × 5.8", 5.8, 7.1, 6.5, 2.6],
  ["M6 × 12.7", 12.7, 8.7, 8.1, 3.3], ["M8 × 12.7", 12.7, 10.2, 9.7, 4.5], ["M10 × 12.7", 12.7, 12.6, 12.0, 6.0],
];
const CNC_TITEL = "Gewindeeinsätze CNC Kitchen (metrisch)";
if (!(await db.bibliothekseintrag.findFirst({ where: { titel: CNC_TITEL } }))) {
  const kategorie = await db.bibliothekskategorie.findUnique({ where: { name: "Gewinde & Schrauben" } });
  let reihenfolge = 0;
  await db.bibliothekseintrag.create({
    data: {
      titel: CNC_TITEL,
      kategorieId: kategorie?.id,
      quelle: "CNC Kitchen – Dimensions & Design Guidelines, Metric Size Inserts (cnckitchen.store)",
      beschreibung:
        "Einschmelz-Gewindeeinsätze von CNC Kitchen. Pro Größe: Bohrungsdurchmesser D2, Mindesttiefe für ein Sackloch, Einsatzlänge L, Außendurchmesser D1 und Mindestwandstärke W.",
      druckhinweis:
        "Bohrung mit Ø D2 konstruieren. Sackloch mindestens L + 1 mm tief; Durchgangsloch ist ebenfalls möglich. Rundum mindestens die Wandstärke W stehen lassen.",
      schlagworte: "Gewindeeinsatz, Einschmelzmutter, Heat Set Insert, Kernbohrung, Gewinde, M2, M2.5, M3, M4, M5, M6, M8, M10",
      masse: {
        create: CNC_EINSAETZE.flatMap(([variante, l, d1, d2, w]) =>
          (
            [
              ["Bohrung Ø (D2)", d2, "Kernbohrung für den Einsatz"],
              ["Bohrtiefe Sackloch", Math.round((l + 1) * 10) / 10, "mindestens L + 1 mm"],
              ["Länge Einsatz (L)", l, null],
              ["Außen-Ø Einsatz (D1)", d1, null],
              ["Mindestwandstärke (W)", w, "Wand um die Bohrung"],
            ] as [string, number, string | null][]
          ).map(([bezeichnung, wert, notiz]) => ({ variante, bezeichnung, wert, notiz, einheit: "mm", reihenfolge: reihenfolge++ })),
        ),
      },
    },
  });
}

const email = process.env.ADMIN_EMAIL;
const passwort = process.env.ADMIN_PASSWORT;
if (email && passwort) {
  await db.benutzer.upsert({
    where: { email },
    update: {},
    create: {
      name: process.env.ADMIN_NAME ?? "Admin",
      email,
      passwortHash: await bcrypt.hash(passwort, 12),
      rolle: "ADMIN",
    },
  });
} else {
  console.warn("ADMIN_EMAIL / ADMIN_PASSWORT fehlen in .env – kein Admin angelegt.");
}

await db.$disconnect();
console.log("Startbestand angelegt.");
