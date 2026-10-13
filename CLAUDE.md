# CLAUDE.md

Arbeitsregeln für dieses Projekt. Fachliche Details stehen in `docs/` – dort nachlesen, nicht raten.

## Projekt

Web-App zur Dokumentation und Planung von 3D-Druck-Aufträgen an einem Theater. Hierarchie: **Stück → Auftrag → Druckjob (auf einem Drucker)**. Nutzung am Handy und am PC, zunächst durch eine Person, später ein Kollege, noch später Anfragen aus anderen Abteilungen.

- Anforderungen: [docs/ANFORDERUNGEN.md](docs/ANFORDERUNGEN.md)
- Datenmodell: [docs/DATENMODELL.md](docs/DATENMODELL.md)
- Architektur und Ordnerstruktur: [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md)
- Design: [docs/DESIGN.md](docs/DESIGN.md)
- Ausbaustufen: [docs/ROADMAP.md](docs/ROADMAP.md)
- Entscheidungen: [docs/ENTSCHEIDUNGEN.md](docs/ENTSCHEIDUNGEN.md)

## Technik

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma mit SQLite · Datei-Uploads im lokalen Ordner `data/uploads`.

## Befehle

| Zweck | Befehl |
|---|---|
| Entwicklungsserver | `npm run dev` |
| Produktions-Build | `npm run build` und `npm run start` |
| Typprüfung / Lint | `npm run typecheck` / `npm run lint` |
| Tests | `npm test` |
| DB-Migration anlegen | `npx prisma migrate dev --name <name>` |
| Beispieldaten | `npx prisma db seed` |

## Konventionen

- **Sprache:** Oberfläche komplett auf Deutsch. Fachbegriffe im Code ebenfalls deutsch, ohne Umlaute (`stueck`, `auftrag`, `drucker`, `druckjob`, `abteilung`); technische Begriffe englisch (`components`, `lib`, `actions`).
- **Mobil zuerst:** Jede Ansicht muss bei 375 px Breite ohne horizontales Scrollen funktionieren. Formulare mit großen Touch-Zielen (min. 44 px).
- **Daten ändern** über Server Actions in `src/server/`, Eingaben immer mit Zod validieren. Kein Datenbankzugriff aus Client-Komponenten.
- **Schema-Änderungen** nur über Prisma-Migrationen und immer zusammen mit einer Anpassung von `docs/DATENMODELL.md`.
- **Dateien** nie in der Datenbank speichern – nur Metadaten; die Datei liegt in `data/uploads`.
- **Rollen mitdenken:** Jede Server Action prüft die Berechtigung, auch solange es nur einen Nutzer gibt.
- **Nichts aus `data/` committen** (Datenbank und Uploads sind Nutzdaten).
- Kleine, nachvollziehbare Schritte; nach jedem Feature Typprüfung und Tests laufen lassen und die Ansicht mobil und am Desktop im Browser prüfen.
- Neue Grundsatzentscheidungen in `docs/ENTSCHEIDUNGEN.md` festhalten.

## Nicht tun

- Keine Funktionen aus späteren Roadmap-Phasen vorziehen, ohne dass es abgesprochen ist.
- Keine Cloud-Dienste oder externen Speicher einbinden, solange die Hosting-Frage offen ist (siehe Entscheidungen).
