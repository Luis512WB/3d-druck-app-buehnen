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
