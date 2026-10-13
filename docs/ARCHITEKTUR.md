# Architektur

## Grundsatz

Eine einzige, selbst betriebene Web-Anwendung: ein Prozess, eine Datenbankdatei, ein Ordner mit Bildern. Kein separater Server-Dienst, keine Cloud-Abhängigkeit. Das hält Betrieb und Backup einfach und lässt sich später trotzdem auf einen Server umziehen.

## Technik

| Bereich | Wahl | Warum |
|---|---|---|
| Framework | Next.js (App Router) mit TypeScript | Oberfläche und Serverlogik in einem Projekt |
| Gestaltung | Tailwind CSS, eigene schlanke Komponenten | Schlichtes, einheitliches Design ohne großes UI-Paket |
| Datenbank | SQLite über Prisma | Eine Datei, kein DB-Server; für wenige Nutzer mehr als ausreichend. Wechsel auf PostgreSQL bleibt über Prisma möglich |
| Dateien | Lokaler Ordner `data/uploads`, Vorschaubilder mit `sharp` | Bilder bleiben im Haus, leicht zu sichern |
| Validierung | Zod | Gleiche Regeln für Formular und Server |
| Anmeldung | E-Mail + Passwort, Sitzungs-Cookie, Rollen | Reicht für 2 Nutzer und ist auf Abteilungen erweiterbar |
| Mobil | Responsive Layout + PWA-Manifest | „Zum Startbildschirm hinzufügen“ ohne App-Store |
| Tests | Vitest (Logik), Playwright (wichtigste Abläufe) | |

## Projektstruktur

```
3D-Druck App Bühnen/
├── README.md
├── CLAUDE.md
├── docs/                      Projektdokumentation
├── prisma/
│   ├── schema.prisma          Datenmodell
│   ├── migrations/
│   └── seed.ts                Abteilungen, Beispieldrucker, erster Admin
├── public/                    Icons, PWA-Manifest
├── scripts/
│   └── backup.ps1             Sichert data/ mit Datum
├── data/                      NUTZDATEN – nicht im Git
│   ├── app.db
│   └── uploads/
│       └── <jahr>/<auftragsnummer>/…
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── (app)/             alles hinter der Anmeldung
│   │   │   ├── layout.tsx     Navigation (unten mobil, seitlich am Desktop)
│   │   │   ├── page.tsx       Startseite / Übersicht
│   │   │   ├── stuecke/       Liste, [id], neu
│   │   │   ├── auftraege/     Liste/Board, [id], neu
│   │   │   ├── planung/       Zeitleiste der Drucker        (Phase 2)
│   │   │   ├── drucker/       Druckerverwaltung             (Phase 2)
│   │   │   ├── anfragen/      Formular für Abteilungen      (Phase 4)
│   │   │   └── einstellungen/ Abteilungen, Benutzer
│   │   └── api/
│   │       ├── dateien/[id]/  Auslieferung von Bildern/Dateien (mit Rechteprüfung)
│   │       └── export/        ZIP eines Auftrags, CSV
│   ├── components/
│   │   ├── ui/                Button, Eingabefeld, Chip, Dialog …
│   │   ├── layout/            Navigation, Seitenkopf
│   │   ├── stuecke/
│   │   ├── auftraege/         Formular, Karte, Maßtabelle, Bildergalerie
│   │   └── planung/           Zeitleiste, Job-Dialog
│   ├── server/                Server Actions und Abfragen je Fachbereich
│   │   ├── stuecke.ts
│   │   ├── auftraege.ts
│   │   ├── anhaenge.ts
│   │   ├── druckjobs.ts
│   │   └── benutzer.ts
│   └── lib/
│       ├── db.ts              Prisma-Client
│       ├── auth.ts            Sitzung, Rollenprüfung
│       ├── uploads.ts         Speichern, Vorschaubilder, Löschen
│       ├── schemas/           Zod-Schemas
│       └── format.ts          Datum, Gramm, Dauer
└── tests/
```

## Datenfluss

- **Lesen:** Server-Komponenten rufen Abfragen aus `src/server/` auf und rendern direkt.
- **Schreiben:** Formulare → Server Action → Zod-Prüfung → Rechteprüfung → Prisma → Seite neu laden.
- **Upload:** Formular → Server Action speichert Original unter `data/uploads/…`, erzeugt eine Vorschau (ca. 1600 px) und ein Miniaturbild, legt den `Anhang`-Datensatz an.
- **Abruf von Dateien:** ausschließlich über `/api/dateien/[id]`, nie als öffentlicher Ordner – so greifen die Rollen auch für Bilder.

## Rollen

| Aktion | Admin | Bearbeiter | Anforderer |
|---|---|---|---|
| Stücke/Aufträge sehen | alle | alle | nur eigene Anfragen |
| Aufträge anlegen/bearbeiten | ja | ja | nur anfragen |
| Drucke planen | ja | ja | nein |
| Drucker, Abteilungen, Benutzer verwalten | ja | nein | nein |

## Betrieb

**Stufe 1 – eigener Rechner im Hausnetz:** App läuft auf dem Arbeits-PC oder einem kleinen, dauerhaft laufenden Rechner. Zugriff vom Handy über das Hausnetz/WLAN (`http://<Rechnername>:3000`).

**Stufe 2 – fester kleiner Server:** Mini-PC oder NAS (optional per Docker), feste Adresse, HTTPS über die Haus-IT. Notwendig, sobald Abteilungen zugreifen und für die volle PWA-Installation.

**Stufe 3 – extern erreichbar:** nur in Abstimmung mit IT und Datenschutz.

Der Code liegt in einem privaten GitHub-Repository; `data/` ist davon ausgenommen. Ob die App im Haus oder extern betrieben wird, ist noch offen – siehe O-1 in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md).

## Backup

Alles Wichtige liegt in `data/` (Datenbank + Uploads). `scripts/backup.ps1` kopiert den Ordner mit Datumsstempel auf ein zweites Laufwerk/Netzlaufwerk; per Windows-Aufgabenplanung täglich ausführen. Wiederherstellung = Ordner zurückkopieren.
