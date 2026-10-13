# 3D-Druck App Bühnen

Web-App zum Dokumentieren und Planen von 3D-Druck-Aufträgen am Theater – nutzbar am Handy (auf der Bühne, in der Werkstatt) und am PC (bei der Konstruktion).

## Idee in einem Satz

Ein **Stück** anlegen (z. B. *Otello*), darunter **Aufträge** mit Abteilung, Priorität, Farbe, Filamentmenge, Maßen, Bildern und Notizen erfassen – und die Drucke anschließend auf die vorhandenen **Drucker** einplanen.

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

Planungsphase – es gibt noch keinen Code. Nächster Schritt ist Phase 0 der [Roadmap](docs/ROADMAP.md) (Grundgerüst aufsetzen).

## Starten (sobald das Grundgerüst steht)

```bash
npm install
```

```bash
npm run dev
```

Danach im Browser `http://localhost:3000` öffnen. Vom Handy im selben Netzwerk: `http://<Rechnername>:3000`.
