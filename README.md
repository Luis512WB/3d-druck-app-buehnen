# 3D-Druck App Bühnen

Web-App zum Dokumentieren und Planen von 3D-Druck-Aufträgen am Theater – nutzbar am Handy (auf der Bühne, in der Werkstatt) und am PC (bei der Konstruktion).

## Idee in einem Satz

Ein **Stück** anlegen (z. B. *Otello*), darunter **Aufträge** mit Abteilung, Priorität, Farbe, Filamentmenge, Maßen, Bildern und Notizen erfassen – und die Drucke anschließend auf die vorhandenen **Drucker** einplanen.

Dazu kommt eine **Maßbibliothek** für Standardmaße aus dem Alltag (Kabelverschraubungen, DMX-Anschlüsse, Gewinde …).

## Typischer Ablauf

1. Auf der Bühne am Handy: Stück wählen → neuer Auftrag → Fotos machen, Maße und Notizen eintragen → speichern.
2. Am Rechner: Auftrag öffnen, Bilder und Maße neben dem CAD-Programm ansehen, konstruieren, CAD-/Slicer-Dateien anhängen.
3. Druck einplanen: Drucker und Zeitfenster wählen, Status verfolgen, tatsächlichen Filamentverbrauch nachtragen.
4. Fertig melden und an die Abteilung übergeben – alles bleibt beim Stück dokumentiert.

## Dokumentation

| Datei | Inhalt |
|---|---|
| [docs/ANFORDERUNGEN.md](docs/ANFORDERUNGEN.md) | Was die App können soll, Nutzergruppen, Abläufe |
| [docs/DATENMODELL.md](docs/DATENMODELL.md) | Stücke, Aufträge, Drucker, Druckjobs … und ihre Felder |
| [docs/ARCHITEKTUR.md](docs/ARCHITEKTUR.md) | Technik, Projektstruktur, Betrieb und Backup |
| [docs/DESIGN.md](docs/DESIGN.md) | Gestaltung: schlicht, modern, mobil zuerst |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Ausbaustufen vom MVP bis zur Abteilungs-Anfrage |
| [docs/ENTSCHEIDUNGEN.md](docs/ENTSCHEIDUNGEN.md) | Getroffene und noch offene Entscheidungen |
| [CLAUDE.md](CLAUDE.md) | Arbeitsregeln für die Entwicklung mit Claude Code |

## Stand

Phase 0 (Grundgerüst) ist fertig: Anmeldung, Navigation für Handy und Desktop, Datenbank mit Startbestand (9 Abteilungen, 2 Drucker). Stücke, Aufträge und Maßbibliothek folgen laut [Roadmap](docs/ROADMAP.md).

## Einrichten (einmalig, auf einem neuen Rechner)

1. `.env.example` nach `.env` kopieren und die Werte eintragen (Admin-E-Mail, Passwort, langer Zufallswert).
2. Pakete installieren und Datenbank anlegen:

```bash
npm install
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed
```

## Starten

```bash
npm run dev
```

Danach im Browser `http://localhost:3000` öffnen und mit der E-Mail und dem Passwort aus `.env` anmelden.

Die Nutzdaten liegen im Ordner `data/` (Datenbank und später Bilder). Dieser Ordner und `.env` werden nicht zu GitHub hochgeladen.
