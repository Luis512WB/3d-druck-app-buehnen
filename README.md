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

Nutzbar sind: Stücke, Aufträge (mit Bildern, Dateien, Maßen, Notizen, ZIP-Download), Maßbibliothek, Abteilungen und Kategorien. Die Druckerplanung folgt in Phase 2 der [Roadmap](docs/ROADMAP.md).

## Starten

Doppelklick auf **`Starten.bat`** im Projektordner. Das Fenster zeigt die Adressen an und muss offen bleiben, solange die App genutzt wird:

- am Rechner: `http://localhost:3000`
- am Handy im selben WLAN: `http://<IPv4-Adresse des Rechners>:3000`

Anmelden mit der E-Mail und dem Passwort aus `.env`; das Passwort lässt sich unter *Einstellungen* ändern.

## Daten und Sicherung

Alle Nutzdaten liegen im Ordner `data/` (Datenbank `app.db` und `uploads/`). Dieser Ordner und `.env` werden **nicht** zu GitHub hochgeladen. Sichern:

```bash
powershell -File scripts/backup.ps1 -Ziel "D:\Sicherung\3D-Druck"
```

## Einrichten auf einem neuen Rechner

1. Node.js installieren und das Repository herunterladen.
2. `.env.example` nach `.env` kopieren und die Werte eintragen.
3. Pakete installieren, Datenbank anlegen und Startbestand einspielen:

```bash
npm install
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma db seed
```

## Entwickeln

```bash
npm run dev
```

